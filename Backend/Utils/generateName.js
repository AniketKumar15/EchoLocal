export function generateUsername() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}";
    let name = "";
    for (let i = 0; i < 12; i++) {
        name += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return "User_" + name;
}
