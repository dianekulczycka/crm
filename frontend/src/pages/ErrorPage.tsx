import React, {FC} from 'react';

const ErrorPage: FC = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <h1 className="text-danger"> Sorry! Not found </h1>
        </div>
    );
};

export default ErrorPage;