const fs = require('fs');
const path = require('path');


// Function for reading the last avatar state
function readLastAvatar() {
    try {
        const filePath = path.join(__dirname, '../logs/lastAvatar.txt');
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        // In case of an error (e.g., if the file does not exist), return a default value
        return 'Sofia';
    }
}

// Function for saving the current avatar state
function saveLastAvatar(avatar) {
    const filePath = path.join(__dirname, '../logs/lastAvatar.txt');
    fs.writeFileSync(filePath, avatar, 'utf8');
}

module.exports = {
   readLastAvatar, saveLastAvatar
};
