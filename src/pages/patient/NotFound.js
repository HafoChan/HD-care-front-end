import React from 'react';
import '../../NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1>404</h1>
            <p>Oops! Trang bạn tìm kiếm không tồn tại.</p>
            <p><a href="/">Quay lại trang chủ</a></p>
        </div>
    );
};

export default NotFound;
