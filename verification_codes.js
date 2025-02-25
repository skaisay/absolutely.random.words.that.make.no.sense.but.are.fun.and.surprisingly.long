// Массив валидных кодов верификации
const validVerificationCodes = [
    "A1B2C3D4E5F61111",
    "B2C3D4E5F6A72222",
    "C3D4E5F6A7B83333",
    "D4E5F6A7B8C94444",
    "E5F6A7B8C9D05555",
    "F6A7B8C9D0E16666",
    "1111222233334444",
    "5555666677778888",
    "9999AAAABBBBCCCC",
    "DDDDEEEEFFFF0000",
    "1A2B3C4D5E6F7890",
    "2B3C4D5E6F7A8901",
    "3C4D5E6F7A8B9012",
    "4D5E6F7A8B9C0123",
    "5E6F7A8B9C0D1234",
    "6F7A8B9C0D1E2345",
    "7A8B9C0D1E2F3456",
    "8B9C0D1E2F3A4567",
    "9C0D1E2F3A4B5678",
    "0D1E2F3A4B5C6789"
];

// Функция проверки кода
function isValidVerificationCode(code) {
    return validVerificationCodes.includes(code);
}
