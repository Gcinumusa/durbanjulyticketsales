import React, { useEffect, useState } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBSpinner } from 'mdb-react-ui-kit';
import { getPosts } from '../lib';
import PostCard from './PostCard';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getPosts();
            setIsError(res.error);
            setPosts(res.data);
            setLoading(false);

        };
        fetchData();
        return () => {};
    }, []);

    if (loading) {
        return(<div classname="d-block text-center">
        <MDBSpinner />
    </div>
    );
    }

    if (!loading && isError) {
        return (
            <div classname="text-center text-danger mt-3">
                <h1>Sorry an error occured</h1>
            </div>
            );
    }

    return (
        <MDBContainer className="mt-3" fluid>
            <MDBRow>
                {posts && posts.map((post) => (
                    <MDBCol className="mb-2" key={post.id} lg="4">
                        <PostCard post={post} />
                    </MDBCol>
                ))}
            </MDBRow>
        </MDBContainer>
    );
}

export default AllPosts;