const getColor = (value: number) => {
    if (value % 5 === 0 && value % 3 === 0) return 'yellow';
    if (value % 3 === 0) return 'green';
    if (value % 5 === 0) return 'blue';
    return 'red';
}

export {
    getColor
}