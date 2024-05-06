const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const compression = require('compression');
const { Client } = require('ssh2');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken'); 
//const { toBeRequired } = require('@testing-library/jest-dom/matchers');

const PORT = process.env.PORT || 4000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('common'));
app.use(compression());
app.use(express.json());

const sshConfig = {
    host: 'server323.web-hosting.com',
    port: 21098,
    username: 'julymjey',
    password: 'w5Wu3CYjQh3Q'
};

const dbConfig = {
    user: 'julymjey_ticketuser',
    password: 'VingaMedia2030',
    database: 'julymjey_ticket'
};

const sshClient = new Client();
let temporaryStorage = {}; 
sshClient.on('ready', () => {
    console.log('SSH Client Ready');
    sshClient.forwardOut('127.0.0.1', 12345, '127.0.0.1', 3306, async (err, stream) => {
        if (err) {
            console.error('Failed to forward port:', err);
            return sshClient.end();
        }
        try {
            const connection = await mysql.createConnection({
                ...dbConfig,
                stream: () => stream
            });

            app.locals.db = connection;  // Store the connection in the app locals
        } catch (error) {
            console.error('Failed to connect to database:', error);
            sshClient.end();
        }
    });
}).connect(sshConfig);

app.post('/register', async (req, res) => {
    const db = req.app.locals.db;
    if (!db) {
        return res.status(503).send({ message: 'Database connection not ready' });
    }

    const { username, lastname, idnumber, phone, email, password, verificationCode } = req.body;
    console.log(`Generated Verification Code for ${email}: ${verificationCode}`); // Log the code

    const hashedPassword = await bcrypt.hash(password, 10);
    temporaryStorage[email] = { username, lastname, idnumber, phone, email, hashedPassword, verificationCode };

    sendVerificationEmail(email, verificationCode);
    res.send({ message: 'Verification code sent. Please check your email.', verificationCode }); // Optionally send back for debugging
});
// User authentication route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const db = req.app.locals.db;
  
    try {
      const [user] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
      if (user.length === 0) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      const isValid = await bcrypt.compare(password, user[0].password);
      if (!isValid) {
        return res.status(401).send({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { id: user[0].id }, // Payload could be user ID or any other user specific data
        'your_secret_key', // Secret key for signing the token
        { expiresIn: '1h' }
      );
  
      res.send({ message: 'Login successful', token, user: user[0] });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).send({ message: 'Error logging in', error: error.message });
    }
  });

  app.get('/api/user-tickets', async (req, res) => {
    const { userIdNumber } = req.query;  // This should be the user's email or ID
    const db = req.app.locals.db;

    if (!db) {
        return res.status(503).send({ message: 'Database connection not ready' });
    }

    try {
        const [tickets] = await db.execute('SELECT * FROM Tickets WHERE useridnumber = ?', [userIdNumber]);
        res.json(tickets);
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        res.status(500).send({ message: 'Error fetching user tickets', error: error.message });
    }
});

// Node/Express: Check if Email Exists
app.get('/api/check-email', async (req, res) => {
    const { userIdNumber } = req.query;
    const db = req.app.locals.db;

    if (!db) {
        return res.status(503).send({ message: 'Database connection not ready' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM Users WHERE idnumber = ?', [userIdNumber]);
        if (rows.length > 0) {
            res.json({ exists: true, user: rows[0] });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking userIdNumber:', error);
        res.status(500).send({ message: 'Error checking userIdNumber', error: error.message });
    }
});


app.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;
    const userData = temporaryStorage[email];

    if (userData && userData.verificationCode.toString() === code) {
        const db = req.app.locals.db;
        const { username, lastname, idnumber, phone, email, hashedPassword } = userData;
        const [result] = await db.execute(
            'INSERT INTO Users (username, lastname, idnumber, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)',
            [username, lastname, idnumber, phone, email, hashedPassword]
        );
        delete temporaryStorage[email];  // Clean up
        res.send({ message: 'User registered successfully', userId: result.insertId });
    } else {
        res.status(400).send({ message: 'Invalid verification code.' });
    }
});

app.get('/api/tickets', async (req, res, next) => {
    const db = req.app.locals.db;
    if (!db) {
        console.error('Database connection not ready');
        return res.status(503).send({ message: 'Database connection not ready' });
    }

    try {
        const [results] = await db.execute('SELECT * FROM Tickets');
        console.log('Sending tickets data:', results);
        res.json(results);
    } catch (err) {
        console.error('Failed to retrieve data:', err);
        res.status(500).send({ message: 'Failed to retrieve data', error: err.message });
    }
});
app.get('/api/onetickets', async (req, res) => {
    const { ticketId } = req.query; // Get ticketId from query parameters
    const db = req.app.locals.db;

    if (!db) {
        console.error('Database connection not ready');
        return res.status(503).send({ message: 'Database connection not ready' });
    }

    try {
        let query = 'SELECT * FROM Tickets';
        const params = [];

        if (ticketId) {
            query += ' WHERE ticket_id = ?';
            params.push(ticketId);
        }

        const [results] = await db.execute(query, params);
        console.log('Sending tickets data:', results);
        res.json(results);
    } catch (err) {
        console.error('Failed to retrieve data:', err);
        res.status(500).send({ message: 'Failed to retrieve data', error: err.message });
    }
});

// Configure the transporter

const transporter = nodemailer.createTransport({
    host: 'julyoceanlounges.com',  // Replace with your SMTP server's host
    port: 465,                // Commonly, 587 for TLS/STARTTLS or 465 for SSL
    secure: true,            // True if 465, false for other ports
    auth: {
        user: 'noreply@julyoceanlounges.com',  // Replace with your SMTP username
        pass: 'VingaMedia2030'           // Replace with your SMTP password
    },
    tls: {
        rejectUnauthorized: true // This should be true in production for security
    }
});


// Function to send an email
function sendVerificationEmail(to, code) {
    console.log(`Sending email to ${to} with code ${code}`); // Log the email and code
    const mailOptions = {
        from: 'noreply@julyoceanlounges.com',
        to: to,
        subject: 'Verification Code',
        html: `<div style="font-family: Arial, sans-serif; color: #333333; background-color: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center;">
        <h1 style="color: #0056b3;">July Ocean Lounge</h1>
        <h4>Your Verification Code:</h4>
        <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; color: #333333;"><b>${code}</b></p>
        </div>
        <p style="margin-top: 20px;">Please use the above code to complete your registration process.</p>
    </div>`
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Email not sent: ' + error);
        } 
    });
}
app.post('/api/allocate-ticket', async (req, res) => {
    const db = req.app.locals.db;
    if (!db) {
        console.log("Database not connected.");
        return res.status(503).send({ message: 'Database connection not ready' });
    }

    const { ticketId, userIdNumber } = req.body;
    console.log(`Attempting to allocate ticket ${ticketId} to user ${userIdNumber}`);

    try {
        // Log the current state of the ticket before attempting update
        const [initialTicket] = await db.execute('SELECT * FROM Tickets WHERE ticket_id = ?', [ticketId]);
        console.log('Ticket before allocation:', initialTicket);

        // Check if ticket is available and not yet sold
        const [ticket] = await db.execute('SELECT * FROM Tickets WHERE ticket_id = ? AND  is_sold = FALSE', [ticketId]);
        if (ticket.length === 0) {
            console.log('Ticket not available or already allocated');
            return res.status(404).send({ message: 'Ticket not available or already allocated' });
        }

        // Allocate ticket to user and mark as sold
        const [update] = await db.execute('UPDATE Tickets SET useridnumber = ?, is_sold = TRUE WHERE ticket_id = ?', [userIdNumber, ticketId]);
        if (update.affectedRows === 1) {
            console.log('Ticket allocated successfully and marked as sold');
            res.send({ message: 'Ticket allocated successfully and marked as sold' });
        } else {
            throw new Error('Failed to allocate ticket');
        }
    } catch (error) {
        console.error('Failed to allocate ticket:', error);
        res.status(500).send({ message: 'Failed to allocate ticket', error: error.message });
    }
});
app.post('/api/update-ticket-quantity', async (req, res) => {
    const { ticketId, userIdNumber, quantity } = req.body;
    const db = req.app.locals.db;

    if (!db) {
        console.error("Database connection not ready.");
        return res.status(503).send({ message: 'Database connection not ready' });
    }

    try {
        // Check current amount of tickets
        const [tickets] = await db.execute('SELECT amountoftickets FROM Tickets WHERE ticket_id = ?', [ticketId]);
        if (tickets.length === 0 || tickets[0].amountoftickets < quantity) {
            return res.status(400).send({ message: 'Not enough tickets available.' });
        }

        // Update ticket quantity in the database
        const remainingTickets = tickets[0].amountoftickets - quantity;
        await db.execute('UPDATE Tickets SET amountoftickets = ? WHERE ticket_id = ?', [remainingTickets, ticketId]);

       
        res.send({ message: 'Ticket quantity updated successfully.' });
    } catch (error) {
        console.error('Failed to update ticket quantity:', error);
        res.status(500).send({ message: 'Failed to update ticket quantity', error: error.message });
    }
});

const generateQR = async (text, filePath) => {
    try {

        await QRCode.toFile(filePath, text);
        console.log("QR code generated");
    }
    catch (err) {
        console.error("error generating QR code :", err);

    }
};

app.get('/api/tickets-attendance', async (req, res) => {
    const { ticketId } = req.query;
    const db = req.app.locals.db;

    try {
        let query = 'SELECT ticket_id, attended FROM Tickets';
        const params = [];

        if (ticketId) {
            query += ' WHERE ticket_id = ?';
            params.push(ticketId);
        }

        const [results] = await db.execute(query, params);
        res.json(results);
    } catch (error) {
        console.error('Failed to retrieve ticket attendance:', error);
        res.status(500).send({ message: 'Failed to retrieve ticket attendance', error: error.message });
    }
});

  

app.post('/process-data', async (req, res) => {
    const { email, phone, idnumber, lastName, amount, cart } = req.body;

    try {
        // Generate QR codes for each seat and store promises
        const qrPromises = cart.map(async (item) => {
            const qrData = `https://www.julyoceanlounges.com/AdminScanQR?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&idnumber=${encodeURIComponent(idnumber)}&lastName=${encodeURIComponent(lastName)}&amount=${encodeURIComponent(amount)}&seat=${encodeURIComponent(item.sitting_number)}&cart=${encodeURIComponent(JSON.stringify([item]))}`;
            const qrImagePath = `./qr_${item.sitting_number}.png`;
            await QRCode.toFile(qrImagePath, qrData);
            console.log("QR code generated for seat:", item.sitting_number);
            return {
                path: qrImagePath,
                filename: `QR_${item.sitting_number}.png`,
                caption: `Seat Number: ${item.sitting_number}`
            };
        });

        // Wait for all QR codes to be generated
        const qrFiles = await Promise.all(qrPromises);

        // Send an email with all QR codes attached
        await sendEmailWithMultipleQR(email, qrFiles);
        res.send({ message: 'Data processed and email sent with QR codes.' });
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).send({ error: 'Failed to process data and send email.' });
    }
});

app.post('/api/update-ticket-attendance', async (req, res) => {
    const { ticketId, isAttended } = req.body;  // `ticketId` is actually the `sitting_number`
  
    console.log("Updating attendance status for sitting number:", ticketId);  // Log the sitting number
  
    const db = req.app.locals.db;
    if (!db) {
      return res.status(503).send({ message: 'Database connection not ready' });
    }
  
    try {
      const [result] = await db.execute(
        'UPDATE Tickets SET attended = ? WHERE sitting_number = ?',
        [isAttended, ticketId]
      );
      if (result.affectedRows === 1) {
        res.send({ message: 'Ticket attendance status updated successfully' });
      } else {
        throw new Error('Failed to update ticket attendance status');
      }
    } catch (error) {
      console.error('Failed to update ticket attendance status:', error);
      res.status(500).send({ message: 'Failed to update ticket attendance status', error: error.message });
    }
  });
  
  


const sendEmailWithMultipleQR = async (to, qrFiles) => {
    const transporter = nodemailer.createTransport({
        host: 'julyoceanlounges.com',
        port: 465,
        secure: true, // since port is 465, we're using SSL
        auth: {
            user: 'noreply@julyoceanlounges.com',
            pass: 'VingaMedia2030'
        },
        tls: {
            rejectUnauthorized: true // Only for development/testing
        }
    });

    const mailOptions = {
        from: 'noreply@julyoceanlounges.com',
        to: to,
        subject: 'Your Event Tickets QR Codes',
        html: '<h4>Saturday, 06 July 2024 @ 11:00</h4> <br> <h4>Your event tickets QR Codes:</h4>',
        attachments: qrFiles.map(file => ({
            filename: file.filename,
            path: file.path,
            cid: file.filename // This can be used in the HTML content to embed images
        }))
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Failed to send email with QR codes:', error);
        throw error; // Rethrow to handle in the calling function
    }
};



app.get('/api', (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
