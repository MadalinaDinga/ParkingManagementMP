
export function getLogger(tag) {
    return (message) => console.log(`${tag} - ${message}`);
}