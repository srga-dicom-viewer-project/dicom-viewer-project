import React from 'react';
import { ProgressBar } from "react-bootstrap"

const UploadProgress = ({ uploadFiles }) => {
    const files = [...uploadFiles.entries()].map(([name, progress], index) => {
        return (
            <tr key={index} style={{ paddingBottom: '10px' }}>
                <td>
                    {name}
                    <ProgressBar now={progress} label={`${progress}%`} />
                </td>
            </tr>
        )
    })

    return <table><tbody>{files}</tbody></table>
}

export default UploadProgress;