import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import UserUpdate from "./components/userUpdate";

const System = () => {
  const { t } = useTranslation();
  const [list, setList] = useState<any[]>([]);
  const [currentPageList, setCurrentPageList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageLength, setPageLength] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dialog, setDialog] = useState({
    userUpdate: false,
    achievement: false,
  });
  const itemsPerPage = 8;
  const [filteredList, setFilteredList] = useState<any[]>([]);

  useEffect(() => {
    // Mock loading users
    const mockUsers = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      user_id: `user_${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: "User",
    }));
    setList(mockUsers);
    setFilteredList(mockUsers);
    setCurrentPageList(mockUsers.slice(0, itemsPerPage));
    setPageLength(Math.ceil(mockUsers.length / itemsPerPage));
  }, []);

  useEffect(() => {
    const start = (page - 1) * itemsPerPage;
    setCurrentPageList(filteredList.slice(start, start + itemsPerPage));
  }, [page, filteredList]);

  const search = () => {
    const filtered = list.filter((user) =>
      user.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setPage(1);
    setFilteredList(filtered);
    setPageLength(Math.ceil(filtered.length / itemsPerPage));
  };

  const deleteUser = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const updatedList = list.filter((user) => user.id !== userId);
      setList(updatedList);
      setFilteredList(updatedList);
      setPage(1);
      setPageLength(Math.ceil(updatedList.length / itemsPerPage));
    }
  };

  const toggleDialog = (type: string, user = null) => {
    if (type === "userUpdate") {
      setIsEditMode(!!user);
      setSelectedUser(user);
      setDialog({ ...dialog, userUpdate: true });
    } else if (type === "achievement") {
      setSelectedUser(user);
      setDialog({ ...dialog, achievement: true });
    }
  };

  const handleSave = (userData: any, isEditMode: boolean) => {
    if (isEditMode) {
      const updatedList = list.map(user => 
        user.id === userData.id ? userData : user
      );
      setList(updatedList);
      setFilteredList(updatedList);
    } else {
      const newUser = {
        ...userData,
        id: list.length + 1,
      };
      setList([...list, newUser]);
      setFilteredList([...list, newUser]);
    }
  };

  return (
    <Container>
      <ActionBar>
        <SearchContainer>
          <SearchInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('system.searchByName')}
          />
          <Button color="#bbb" onClick={search}>
            {t('system.search')}
          </Button>
        </SearchContainer>
        <Button onClick={() => toggleDialog("userUpdate")}>
          {t('system.addUser')}
        </Button>
      </ActionBar>
      <Table>
        <thead>
          <tr>
            <TableHeader>{t('system.id')}</TableHeader>
            <TableHeader>{t('system.name')}</TableHeader>
            <TableHeader>{t('system.email')}</TableHeader>
            <TableHeader>{t('system.role')}</TableHeader>
            <TableHeader>{t('system.actions')}</TableHeader>
          </tr>
        </thead>
        <TableBody>
          {currentPageList.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.user_id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  color="#1976d2"
                  onClick={() => toggleDialog("achievement", user)}
                >
                  {t('system.achievement')}
                </Button>
                <Button
                  color="#FF4858"
                  onClick={() => deleteUser(user.id)}
                >
                  {t('system.delete')}
                </Button>
                <Button
                  color="#1B7F79"
                  onClick={() => toggleDialog("userUpdate", user)}
                >
                  {t('system.edit')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationContainer>
        {Array.from({ length: pageLength }, (_, i) => (
          <Button
            key={i + 1}
            color={i + 1 === page ? "#2196f3" : "#bbb"}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </PaginationContainer>

      {/* User Update Dialog */}
      {dialog.userUpdate && (
        <>
          <Overlay onClick={() => setDialog({ ...dialog, userUpdate: false })} />
          <Dialog>
            <h3>{isEditMode ? t('system.edit') : t('system.addUser')}</h3>
            {/* <p>{t('system.userUpdateForm')}</p> */}
            <UserUpdate
              isEditMode={isEditMode}
              user={selectedUser}
              onClose={() => setDialog({ ...dialog, userUpdate: false })}
              onSave={handleSave}
            />
            <Button onClick={() => setDialog({ ...dialog, userUpdate: false })}>
              {t('system.close')}
            </Button>
          </Dialog>
        </>
      )}

      {/* Achievement Dialog */}
      {dialog.achievement && (
        <>
          <Overlay onClick={() => setDialog({ ...dialog, achievement: false })} />
          <Dialog>
            {/* <h3>Achievements for {selectedUser?.name}</h3> */}
            <p>{t('system.achievementDetails')}</p>
            <Button
              onClick={() => setDialog({ ...dialog, achievement: false })}
            >
              {t('system.close')}
            </Button>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default System;


// Styled Components
const Container = styled.div`
  max-width: 1000px;
  padding: 16px 0;
  margin: auto;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 200px;
  margin-right: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) => props.color || "#2196f3"};
  color: #fff;
  cursor: pointer;
  margin-right: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

const Table = styled.table`
  width: 100%;
  margin: 1rem auto;
  border-collapse: collapse;
  text-align: left;
`;

const TableHeader = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  color: #495057;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
`;


// const TableRow = styled.tr`
//   &:nth-child(even) {
//     background-color: #f9f9f9;
//   }
// `;

const TableRow = styled.tr`
  &:hover {
    background-color: #f9f9f9;
  }
  cursor: pointer;

  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;


const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

const Dialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  width: 500px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const TableBody = styled.tbody``;
