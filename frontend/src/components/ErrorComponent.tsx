import React, {FC} from 'react';

interface IProps {
    error: string | null;
}

const ErrorComponent: FC<IProps> = ({error}) => {

    return (
        <>
            {error && <p className="text-danger">{error.toString()}</p>}
        </>
    );
};

export default ErrorComponent;