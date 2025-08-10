/* eslint-disable react/prop-types */

import { STATUS_COLORS } from "../constants/local";







export default function Badge({ status }) {

    return (
        <span
            className={`${STATUS_COLORS[status]}`}
        >
            {status}
        </span>
    );
}
