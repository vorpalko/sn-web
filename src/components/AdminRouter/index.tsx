import { Button, ButtonTypeMap, Container, Grid, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Switch, Route, BrowserRouter, Redirect, useHistory } from 'react-router-dom'
import AdminLessonsPage from '../../pages/admin-lessons';
import AdminMainPage from '../../pages/admin-main-panel';
import LevelPanel from '../../pages/admin-levels';
import AdminLevelEdit from '../../pages/admin-level-edit';
import UsersAdmin from '../../pages/admin-users';

interface AdminLayerWrapperProps {
    baseUrl: string;
}

const useStyles = makeStyles({
  container: {
    width: "60vw",
    margin: "0 auto",
    marginTop: 40
  }
})

const getAdminUrls = (baseUrl: string) => ({
  ADMIN_LESSONS: `${baseUrl}/lessons`,
  ADMIN_LEVELS: `${baseUrl}/levels`,
  ADMIN_USERS: `${baseUrl}/users`,
  ADMIN_MAIN: `${baseUrl}/main`,
  ADMIN_LEVELS_EDIT: `${baseUrl}/levels/:id`
})

const AdminLayerWrapper:React.FC<AdminLayerWrapperProps> = ({ children, baseUrl }) => {
  const urls = getAdminUrls(baseUrl);
  const history = useHistory();
  const currentLocation = history.location.pathname;

  const styles = useStyles();

  const getButtonVariant = (isActiveButton: boolean): ButtonTypeMap["props"]["color"] => {
    return isActiveButton ? "secondary" : "primary";
  }

  const handleLessonsClick = () => {
    history.push(urls.ADMIN_MAIN)
  }
  const handleLevelssClick = () => {
    history.push(urls.ADMIN_LEVELS)
  }
  const handleUserStatisticsClick = () => {
    history.push(urls.ADMIN_USERS)
  }

  return (
    <Container className={styles.container}>
        <Grid container spacing={5} justify="center" alignItems="center">
          <Grid item>
            <Button
              onClick={handleUserStatisticsClick}
              color={getButtonVariant(currentLocation.startsWith(urls.ADMIN_USERS))}
              variant="contained">
              Пользователи
            </Button>
          </Grid>
        </Grid>
        <Switch>
            <Route path={urls.ADMIN_LEVELS_EDIT} render={(props) => <AdminLevelEdit {...props}/>}/>
            <Route path={urls.ADMIN_LEVELS} render={(props) => <LevelPanel {...props}/>}/>
        <Route path={urls.ADMIN_USERS} render={(props) => <UsersAdmin {...props} /> } />
            <Route path={urls.ADMIN_USERS} render={(props) => <AdminMainPage {...props} />} />
            <Route path={urls.ADMIN_LESSONS} render={(props) => <AdminLessonsPage {...props}/>}/>
        </Switch>
    </Container>
  )
}

export default AdminLayerWrapper;