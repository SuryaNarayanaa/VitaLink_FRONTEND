import React, { useState } from 'react';
import MutltiLinetextInput from '@/components/Patient/MutliLineTextInput';
import { useQueryClient,useMutation } from '@tanstack/react-query';
import { apiClient } from '@/hooks/api';


const OtherMedication = () => {
  const [medications, setMedications] = useState('');
  const [buttonState,setButtonState] = useState<'success' | 'error'  | 'default'>('default') 
  const queryclient = useQueryClient();

  const {mutate:reportMutation,isPending,isSuccess,isError} = useMutation({
     mutationFn: async(formdata:FormData) => {
        const result = await apiClient.post('/patient/report?typ=othermedication',formdata,{
           headers:{'Content-Type': 'multipart/form-data'},
        })
     },
     onSuccess:() => {
        queryclient.invalidateQueries({queryKey:['reports']})
        setMedications('')
        setButtonState("success")
     },
     onError:() => { setButtonState("error") }
  })

  const handleSubmit = () => {
    const formdata = new FormData()
    if(medications === '') return;
    formdata.append('field', medications);
    reportMutation(formdata);
  };

  return (
      <MutltiLinetextInput label='List the names of other medications you are taking'
      text={medications} setText={setMedications}  isSuccces = {buttonState === "success"} isError={buttonState === "error"} 
      handleSubmit={handleSubmit} isPending={isPending}/>
  );
};


export default OtherMedication;