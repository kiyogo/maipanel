#[cfg(test)]
mod tests {
    #[test]
    fn test_bcrypt_hashing() {
        let password = "admin123";
        let hash = bcrypt::hash(password, 10).expect("Mã hóa bcrypt thất bại");
        assert!(bcrypt::verify(password, &hash).expect("Kiểm tra bcrypt thất bại"));
        assert!(!bcrypt::verify("wrong_password", &hash).expect("Kiểm tra bcrypt thất bại"));
    }
}
