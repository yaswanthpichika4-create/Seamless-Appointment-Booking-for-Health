// React Imports
import { useState, useEffect } from "react";
// Hooks
import useTypedSelector from "../../../hooks/useTypedSelector";
// Redux
import { useGetUserQuery, useUpdateUserMutation } from "../../../redux/api/userSlice";
import {
  selectedUserId,
  userIsAdmin,
  userIsDoctor,
} from "../../../redux/auth/authSlice";
// Utils
import {
  formatDateTime,
  getNameInitials,
} from "../../../utils";
// MUI Imports
import { Box, Avatar, Button, Grid } from "@mui/material";
// Custom Imports
import OverlayLoader from "../../../components/Spinner/OverlayLoader";
import Navbar from "../../../components/Navbar";
import { Heading, SubHeading } from "../../../components/Heading";
import PrimaryInput from "../../../components/PrimaryInput/PrimaryInput";
import PrimaryPhoneInput from "../../../components/PhoneInput";
import ToastAlert from "../../../components/ToastAlert/ToastAlert";
import { Form, Formik, FormikProps } from "formik";
import { onKeyDown } from "../../../utils";

interface UserProfileProps {
  userId?: string;
}

interface UserForm {
  name: string;
  phoneNumber: string;
}

const UserProfile = ({ userId: propUserId }: UserProfileProps) => {
  const loggedInUserId = useTypedSelector(selectedUserId);
  const userId = propUserId || loggedInUserId;
  // const isDoctor = useTypedSelector(userIsDoctor);
  const isAdmin = useTypedSelector(userIsAdmin);

  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  const { data, isLoading, isSuccess, refetch } = useGetUserQuery({
    userId,
  });

  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation();

  const [formValues, setFormValues] = useState<UserForm>({
    name: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      setFormValues({
        name: data.data.name,
        phoneNumber: data.data.phoneNumber,
      });
    }
  }, [data, isSuccess]);

  const updateHandler = async (values: UserForm) => {
    try {
      const response: any = await updateUser({
        userId,
        body: values,
      });

      if (response?.data?.status === "success") {
        refetch();
        setToast({
          message: "User updated successfully",
          appearence: true,
          type: "success",
        });
      } else if (response?.error) {
        setToast({
          message: response.error.data.message || "Something went wrong",
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        message: "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };

  const canEdit = isAdmin || userId === loggedInUserId;

  return (
    <>
      {(isLoading || updateLoading) && <OverlayLoader />}
      <Navbar>
        <Heading>Profile Details</Heading>
        <Box
          sx={{
            margin: "20px 0",
            background: "#fff",
            borderRadius: "6px",
            padding: "20px 25px",
            boxShadow: "rgba(0, 0, 0, 0.16) 3px 16px 87px 0px",
            maxWidth: "600px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              margin: "10px 0 20px 0",
            }}
          >
            <Avatar sx={{ width: 80, height: 80, fontSize: "30px" }}>
              {getNameInitials(data?.data?.name)}
            </Avatar>
          </Box>

          <Formik
            initialValues={formValues}
            onSubmit={(values) => updateHandler(values)}
            enableReinitialize
          >
            {(props: FormikProps<UserForm>) => {
              const { values, handleChange, handleBlur } = props;

              return (
                <Form onKeyDown={onKeyDown}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <SubHeading sx={{ marginBottom: "5px" }}>Full Name</SubHeading>
                      <PrimaryInput
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        readOnly={!canEdit}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <SubHeading sx={{ marginBottom: "5px" }}>Phone Number</SubHeading>
                      <PrimaryPhoneInput
                        name="phoneNumber"
                        value={values.phoneNumber}
                        formik={props}
                        readOnly={!canEdit}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ fontSize: "12px", color: "gray" }}>
                        Email: {data?.data?.email}
                      </Box>
                      <Box sx={{ fontSize: "12px", color: "gray" }}>
                        Role: {data?.data?.isAdmin ? "Owner" : data?.data?.isDoctor ? "Doctor" : "User"}
                      </Box>
                      <Box sx={{ fontSize: "12px", color: "gray" }}>
                        Created At: {formatDateTime(data?.data?.createdAt)}
                      </Box>
                    </Grid>
                    {canEdit && (
                      <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={updateLoading}
                          sx={{ padding: "8px 30px" }}
                        >
                          {updateLoading ? "Updating..." : "Update Profile"}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Navbar>
      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={handleCloseToast}
      />
    </>
  );
};

export default UserProfile;
