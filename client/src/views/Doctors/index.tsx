// React Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Redux
import {
  useChangeDoctorStatusMutation,
  useGetAllDoctorsQuery,
} from "../../redux/api/doctorSlice";
// MUI Imports
import { Box, Tooltip, Button } from "@mui/material";
// Utils
import { formatDateTime, maskingPhoneNumber } from "../../utils";
// React Icons
import { TiTickOutline } from "react-icons/ti";
import { MdBlock } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { CgUnblock } from "react-icons/cg";
// Custom Imports
import CustomChip from "../../components/CustomChip";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
import Spinner from "../../components/Spinner";
import { Heading } from "../../components/Heading";
import MUITable, {
  StyledTableRow,
  StyledTableCell,
} from "../../components/MUITable";
import Navbar from "../../components/Navbar";
import OverlayLoader from "../../components/Spinner/OverlayLoader";

const tableHead = [
  "Name",
  "Specialty",
  "Email",
  "Phone Number",
  "Date",
  "Status",
  "Actions",
];

const Doctors = () => {
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState("");
  const [toast, setToast] = useState({
    message: "",
    appearence: false,
    type: "",
  });

  const { data, isLoading, isSuccess } = useGetAllDoctorsQuery({});

  const handleCloseToast = () => {
    setToast({ ...toast, appearence: false });
  };

  const [doctorStatus, { isLoading: doctorLoading }] =
    useChangeDoctorStatusMutation();


  const doctorHandler = async (data: any, status: string) => {
    try {
      const payload = {
        doctorId: data._id,
        status: status,
        userId: data.userId,
      };

      const doctor: any = await doctorStatus(payload);

      if (doctor?.data?.status) {
        setToast({
          ...toast,
          message: "Doctor Status Changed Successfully",
          appearence: true,
          type: "success",
        });
      }
      if (doctor?.error) {
        setToast({
          ...toast,
          message: doctor?.error?.data?.message,
          appearence: true,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Doctor Status Changed Error:", error);
      setToast({
        ...toast,
        message: "Something went wrong",
        appearence: true,
        type: "error",
      });
    }
  };

  return (
    <>
      {isLoading && <OverlayLoader />}
      <Navbar>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Heading>Doctors</Heading>
          <Button variant="contained" onClick={() => navigate("/apply-doctor")}>
            Add Doctor
          </Button>
        </Box>
        <Box
          sx={{
            margin: "20px 0",
            boxShadow: "rgba(0, 0, 0, 0.16) 3px 16px 87px 0px",
          }}
        >
          <MUITable tableHead={tableHead}>
            {isSuccess && data?.data?.length > 0 ? (
              data?.data?.map((row: any) => (
                <StyledTableRow key={`${row.email}`}>
                  <StyledTableCell>{`${row.prefix} ${row.fullName}`}</StyledTableCell>
                  <StyledTableCell>{row.specialization}</StyledTableCell>
                  <StyledTableCell>{row.email}</StyledTableCell>
                  <StyledTableCell>
                    {maskingPhoneNumber(row.phoneNumber)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {formatDateTime(row.createdAt)}
                  </StyledTableCell>
                  <StyledTableCell>
                    <CustomChip
                      label={
                        row.status === "pending"
                          ? "Pending"
                          : row.status === "approved"
                            ? "Approved"
                            : row.status === "blocked"
                              ? "Blocked"
                              : ""
                      }
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    <Tooltip
                      title={
                        row.status === "pending"
                          ? "Approve Doctor"
                          : row.status === "blocked"
                            ? "Unblock User"
                            : "Banned User"
                      }
                      placement="bottom"
                    >
                      <span>
                        {doctorId === row._id && doctorLoading ? (
                          <Spinner size={20} />
                        ) : (
                          <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                doctorHandler(
                                  row,
                                  row.status === "pending"
                                    ? "approved"
                                    : row.status === "blocked"
                                      ? "approved"
                                      : "blocked"
                                );
                                setDoctorId(row._id);
                              }}
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                {row.status === "pending" ? (
                                  <TiTickOutline style={{ fontSize: "20px" }} />
                                ) : row.status === "blocked" ? (
                                  <CgUnblock style={{ fontSize: "17px" }} />
                                ) : (
                                  <MdBlock />
                                )}
                                {row.status === "pending"
                                  ? "Approve"
                                  : row.status === "blocked"
                                    ? "UnBlock"
                                    : "Block"}
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                borderLeft: "1px solid #ccc",
                                paddingLeft: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "3px",
                                cursor: "pointer",
                                color: "blue",
                              }}
                              onClick={() => {
                                navigate(`/profile/${row.userId}`);
                              }}
                            >
                              Edit
                            </Box>
                          </Box>
                        )}
                      </span>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow sx={{ height: "100px" }}>
                <StyledTableCell colSpan={tableHead?.length} align="center">
                  <Box
                    sx={{
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <IoBookOutline />
                    {data?.data?.length === 0 ? "No records found" : ""}
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            )}
          </MUITable>
        </Box>
      </Navbar >
      <ToastAlert
        appearence={toast.appearence}
        type={toast.type}
        message={toast.message}
        handleClose={handleCloseToast}
      />
    </>
  );
};

export default Doctors;
