import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const UserUpdate = ({ isEditMode, user, onClose, onSave }: { isEditMode: boolean, user: any, onClose: () => void, onSave: (userData: any, isEditMode: boolean) => void }) => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    user_id: "",
    pass_word: "",
    name: "",
    email: "",
    role: "Worker",
  });

  const roles = ["Master", "Admin", "Worker"];

  useEffect(() => {
    if (user) {
      setUserData({ ...user });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const { user_id, pass_word, name, email } = userData;

    if (!user_id || !pass_word || !name || !email) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("이메일 형식이 올바르지 않습니다.");
      return;
    }

    onSave(userData, isEditMode);
    onClose();
  };

  return (
    <Container>
      {/* Title */}
      <Title>{isEditMode ? "수정" : "추가"}</Title>

      {/* Form Fields */}
      <Label>아이디</Label>
      <Input
        type="text"
        name="user_id"
        value={userData.user_id}
        onChange={handleChange}
        required
      />

      <Label>비밀번호</Label>
      <Input
        type="password"
        name="pass_word"
        value={userData.pass_word}
        onChange={handleChange}
        required
      />

      <Label>이름</Label>
      <Input
        type="text"
        name="name"
        value={userData.name}
        onChange={handleChange}
        required
      />

      <Label>이메일</Label>
      <Input
        type="email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        required
      />

      <Label>Role</Label>
      <Select
        name="role"
        value={userData.role}
        onChange={handleChange}
        required
      >
        {roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </Select>

      {/* Buttons */}
      <ButtonGroup>
        <Button onClick={onClose}>{t('system.close')}</Button>
        <Button primary onClick={handleSubmit}>
          {isEditMode ? t('system.edit') : t('system.addUser')}
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default UserUpdate;


// Styled Components
const Container = styled.div`
  background: #fff;
  padding: 24px 40px;
  border-radius: 16px;
  text-align: left;
`;

const Title = styled.p`
  font-size: 1.25rem;
  margin-bottom: 24px;
  font-weight: bold;
`;

const Label = styled.p`
  margin-bottom: 8px;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;


const Button = styled.button<{ primary?: boolean }>`
  width: 48%;
  padding: 8px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  color: #fff;

  background: ${(props) => (props.primary ? "#2196f3" : "#bbb")};

  &:hover {
    opacity: 0.9;
  }
`;
