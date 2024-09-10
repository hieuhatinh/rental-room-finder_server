const skip = ({ page, limit }) => {
    return (page - 1) * limit
}

export default skip
