import {Modal, Box, Typography, TextField } from '@mui/material'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {LoadingButton} from '@mui/lab'

const lotterySchema=Yup.object({
    name:Yup.string().min(4).required(),
    prize:Yup.string().min(4).required(),
});

interface Props{
    open:boolean;
    onClose:()=>void;
    createNewLottery:(lotteryData:{
        name:string;
        prize:string;
    })=>Promise<void>
    loading:boolean;
    error?:string;

}

export default function AddLotteryModal({
    open,
    onClose,
    createNewLottery,
    loading,
    error,
}:Props){
    const handleClose=()=>{
        formik.resetForm();
        onClose();
    };

    const formik=useFormik({
        validationSchema:lotterySchema,
        validateOnChange:true,
        isInitialValid:false,
        initialValues:{
            name:'',
            prize:'',
        },
        onSubmit:(values)=>{
            createNewLottery({name:values.name,prize:values.prize})
            .then(()=>{
                handleClose();
            })
            .catch(()=>{

            });
        },
    });
    return (
        <Modal open={open} onClose={handleClose}>
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                boxShadow: 24,
                pt: 4,
                px: 6,
                pb: 3,
              }}
            >
              <Typography variant="h5" sx={{ mb: 4 }}>
                Add a new lottery
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  sx={{ mb: 4 }}
                  label="Lottery name"
                  variant="standard"
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  error={Boolean(formik.errors.name && formik.touched.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                  sx={{ mb: 4 }}
                  label="Lottery prize"
                  variant="standard"
                  name="prize"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.prize}
                  error={Boolean(formik.errors.prize && formik.touched.prize)}
                  helperText={formik.touched.prize && formik.errors.prize}
                />
              </Box>
              {error && (
                <Typography sx={{ mb: 2 }} color="red">
                  {error}
                </Typography>
              )}
              <LoadingButton
                loading={loading}
                variant="contained"
                color="primary"
                type="submit"
                disabled={!formik.isValid}
              >
                Add
              </LoadingButton>
            </Box>
          </form>
        </Modal>
      );
    }