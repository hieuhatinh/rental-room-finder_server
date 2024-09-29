export const LIMIT = 10
export const PAGE = 1

const skip = ({ page = 1, limit }) => {
    return (page - 1) * limit
}

export default skip
