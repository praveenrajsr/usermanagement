import React, { useContext, useEffect, useMemo, useState } from 'react'
import AuthContext from '../context/AuthContext'
import Base from '../components/Base'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { TextField, Button, Switch, FormControlLabel } from '@mui/material'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import {
    DataGrid, GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridPagination,
    gridPageCountSelector,
    GridToolbarExport,
    GridToolbarQuickFilter,
    useGridApiContext,
    GridCellParams,
    useGridSelector,
    GridToolbarDensitySelector,
} from '@mui/x-data-grid'

import { useDemoData } from '@mui/x-data-grid-generator'
import { fetchUsersList, addUser, deleteUser, editUser } from '../helper/users'
import LinearProgress from '@mui/material/LinearProgress';
import Slide from '@mui/material/Slide';

// Modal / Dialog box
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MuiPagination from '@mui/material/Pagination';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Snackbar from '@mui/material/Snackbar';

const DeleteConfirmation = ({ open, setAlert, handleDelete }) => {
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="down" ref={ref} {...props} />;
    });
    return (
        <div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setAlert(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Delete Users?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Are you sure want to delete the users? You cannot revert this action
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ mb: 1 }}>
                    <Button variant='contained' onClick={() => setAlert(false)}>No</Button>
                    <Button onClick={() => handleDelete()}>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

function EditToolbar(props) {
    return (
        <Box
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                p: 1,
            }}
        >
            {/* <Button variant='outlined'>Edit</Button> */}
            {/* <Button variant='text' sx={{ ml: 1 }}>
                <SaveIcon />
            </Button>
            <Button variant='text' sx={{ ml: 1 }}>
                <CancelIcon />
            </Button> */}
            {props.selectedRows.length ?
                // <Button variant='contained' sx={{ ml: 1 }} onClick={() => props.handleDelete()}><DeleteIcon /></Button> 
                <Button variant='contained' sx={{ ml: 1 }} onClick={() => props.setAlertDelete(true)}><DeleteIcon /></Button>
                :
                ''
            }
        </Box>
    )
}

function UserToolbar(allRows, selectedRows, handleDialogOpen, setAlertDelete) {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
            <Box sx={{ flexGrow: 1 }}>
                <EditToolbar selectedRows={selectedRows} setAlertDelete={setAlertDelete} />
            </Box>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleDialogOpen}>
                Add record
            </Button>
            <GridToolbarQuickFilter />
        </GridToolbarContainer>
    );
}

const Dashboard = () => {
    const { user, authTokens } = useContext(AuthContext)
    const [err, setErr] = useState(false)
    const [userList, setUserList] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedRows, setSelectedRows] = useState([])

    const [isFormInValid, setIsFormInValid] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [alertDelete, setAlertDelete] = useState(false)

    const [rows, setRows] = useState(userList)

    const [snackbar, setSnackbar] = useState(null)
    const [staff, setStaff] = useState(true)
    const [premium, setPremium] = useState(false)

    const handleCloseSnackbar = () => setSnackbar(null);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsFormInValid(false)
        setDialogOpen(false);
    };

    const table_data = {
        columns: [
            { field: 'id', filterable: false, width: 50 },
            { field: 'email', filterable: true, editable: true, width: 200 },
            { field: 'is_premium', filterable: true, editable: true, type: "boolean" },
            { field: 'is_staff', filterable: true, editable: true, type: "boolean" },

            {
                field: 'name',
                filterable: true,
                width: 200,
                editable: true
            },
            { field: 'phone', filterable: true, width: 200, }
        ]
    }

    const getAllUsers = () => {

        fetchUsersList(authTokens.access).then((data) => {
            if (data.error) {
                setErr(data.error)
                console.log(data.error)
            } else {
                setUserList(data)
                if (loading) setLoading(false)
            }
        }).catch(err => console.log(err))
    }
    useEffect(() => {
        getAllUsers();
        return () => {
            setUserList([])
        }
    }, [loading])

    const handleAddUser = (e, token) => {
        e.preventDefault()
        if (e.target.password.value === e.target.confirmpassword.value) {
            if (!loading) setLoading(true)
            addUser(e, token, getAllUsers).then(() => {
                if (loading) setLoading(false)
                handleDialogClose()
            })
        } else {
            setIsFormInValid(true)
        }

    }

    const handleDelete = () => {
        selectedRows.map((eachRow, index) => {
            deleteUser(eachRow['id'], authTokens.access, getAllUsers).then(() => {
                setAlertDelete(false)
            })
            return true
        })
    }
    // Pagination
    function Pagination({ page, onPageChange, className }) {
        const apiRef = useGridApiContext();
        const pageCount = useGridSelector(apiRef, gridPageCountSelector);

        return (
            <MuiPagination
                color="primary"
                className={className}
                count={pageCount}
                page={page + 1}
                onChange={(event, newPage) => {
                    onPageChange(event, newPage - 1);
                }}
            />
        );
    }
    Pagination.propTypes = {
        className: PropTypes.string,

        onPageChange: PropTypes.func.isRequired,

        page: PropTypes.number.isRequired,
    };

    function CustomPagination(props) {
        return <GridPagination ActionsComponent={Pagination} {...props} />;
    }

    const processRowUpdate =
        async (newRow) => {
            // Make the HTTP request to save in the backend
            const response = await editUser(newRow['id'], authTokens.access, newRow, getAllUsers);
            setSnackbar({ children: 'User successfully saved', severity: 'success' });
            return response;
        }

    const handleProcessRowUpdateError = React.useCallback((error) => {
        setSnackbar({ children: error.message, severity: 'error' });
    }, []);
    return (
        <Base title="Dashboard">
            {/* Add User Dialog Box */}
            {alertDelete &&
                <DeleteConfirmation open={alertDelete} setAlert={setAlertDelete} handleDelete={handleDelete} />
            }

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Add User</DialogTitle>
                <form onSubmit={(e) => handleAddUser(e, authTokens.access)}>
                    <DialogContent >
                        <Box sx={{ py: 1 }}>
                            <TextField id="outlined-basic" label="Name" variant="outlined" name="name" fullWidth required />
                        </Box>
                        <Box sx={{ pb: 1 }}>
                            <TextField id="outlined-basic" label="Mobile number" maxLength="10" variant="outlined" inputProps={{ maxLength: 10 }} name="mobile" fullWidth required />
                        </Box>
                        <Box sx={{ pb: 1 }}>
                            <TextField id="outlined-basic" type='email' label="Email Address" variant="outlined" name="email" fullWidth required />
                        </Box>
                        <Box sx={{ pb: 1 }}>
                            <TextField type='password' id="outlined-basic" label="Password" autoComplete="off" error={isFormInValid} variant="outlined" name="password" helperText={isFormInValid && "Passwords doesn't match"} fullWidth required />
                        </Box>
                        <Box sx={{ pb: 1 }}>
                            <TextField type='password' id="outlined-basic" label="Confirm password" variant="outlined" name="confirmpassword" error={isFormInValid} helperText={isFormInValid && "Passwords doesn't match"} fullWidth required />
                        </Box>
                        <FormControlLabel control={<Switch name='premium' />} label="Premium User" />
                        <FormControlLabel control={<Switch name="staff" defaultChecked />} label="Staff User" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                        <Button type='submit'>Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container sx={{ mt: 4, mb: 4 }} >
                    <Typography component="p" mb={2}>Welcome {user.name}!</Typography>
                    <Grid container spacing={2}>
                        <Grid xs={12} lg={3}>
                            <Card>
                                <CardContent>
                                    <Typography component="h5" fontWeight={600}>
                                        Total users
                                    </Typography>
                                    <Typography component="p" variant='h3' fontWeight={600} color="green" >
                                        {!loading ? userList.length : <CircularProgress />}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
                {!loading &&
                    <Container>
                        <DataGrid
                            rows={userList}
                            getRowId={(row) => row['id']}
                            processRowUpdate={processRowUpdate}
                            onProcessRowUpdateError={handleProcessRowUpdateError}
                            pagination
                            checkboxSelection
                            onRowSelectionModelChange={(id) => {
                                const selectedId = new Set(id);
                                const rowsSelected = userList.filter((row) => {
                                    return selectedId.has(row.id)
                                })
                                setSelectedRows(rowsSelected)
                            }}
                            columns={table_data.columns}
                            slots={{ toolbar: () => UserToolbar(userList, selectedRows, handleDialogOpen, setAlertDelete), pagination: CustomPagination, loadingOverlay: LinearProgress, }}
                            initialState={{
                                ...userList.initialState,
                                pagination: { paginationModel: { pageSize: 2 } },
                            }}
                            getSelectedRows
                            editMode='row'
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                    quickFilterProps: { debounceMs: 500 },
                                },
                            }}
                            autoHeight
                            pageSizeOptions={[2, 12, 25]}
                        />
                    </Container>
                }
                {!!snackbar && (
                    <Snackbar
                        open
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        onClose={handleCloseSnackbar}
                        autoHideDuration={6000}
                    >
                        <Alert {...snackbar} onClose={handleCloseSnackbar} />
                    </Snackbar>
                )}
            </Box>
        </Base>
    )
}

export default Dashboard