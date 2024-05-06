import React from "react";
import { MDBContainer, MDBNavbar, MDBNavbarBrand } from "mdb-react-ui-kit";

export default function Navbar() {
    return (
        <>
            <MDBNavbar light bgColor="light">
                <MDBContainer fluid>
                    <MDBNavbarBrand tag="span" className="mb-2 h1">
                        ratemyagent
                    </MDBNavbarBrand>
                </MDBContainer>
            </MDBNavbar>
        </>
    );
}