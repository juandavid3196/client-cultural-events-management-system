// In src/components/notfound/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>Oops, we couldn't find what you were looking for.</p>
            <Link to="/">Go Back Home</Link>
        </div>
    );
}

export default NotFoundPage;
