import React from 'react';
import { useOutlet } from 'react-router';

function Admin() {
    const outlet = useOutlet();
    return <div>{outlet || <div>Admin Page</div>}</div>;
}

export default Admin;
