import React from 'react';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText,
     MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';

const PostCard = ({ post }) => {
    return (
        <MDBCard className="h-100" style={{ width: '100%' }}>
            <MDBCardImage src={post.photoUrl} postion="top" alt={post.title} />
            <MDBCardBody>
                <MDBCardTitle>{post.title}</MDBCardTitle>
                <MDBCardText>
                    {post.content}
                </MDBCardText>
                <MDBBtn href='#'>Read More</MDBBtn>
            </MDBCardBody>
        </MDBCard>
    );
}

export default PostCard;