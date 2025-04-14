import React, { useState } from 'react';
import MutltiLinetextInput from '@/components/Patient/MutliLineTextInput';
import { useQueryClient,useMutation } from '@tanstack/react-query';
import { apiClient } from '@/hooks/api';

const ProlongedIllness = () => {
  const [illnessDetails, setIllnessDetails] = useState(''); 
  const queryclient= useQueryClient();
  const [buttonState,setButtonState] = useState<'success' | 'error'  | 'default'>('default') 

  const {mutate:reportMutation,isPending,isSuccess,isError} = useMutation({
       mutationFn: async(formdata:FormData) => {
          const result = await apiClient.post('/patient/report?typ=prolongedillness',formdata,{
             headers:{'Content-Type': 'multipart/form-data'},
          })
       },
       onSuccess:() => {
          queryclient.invalidateQueries({queryKey:['reports']})
          setIllnessDetails('')
          setButtonState("success")
       },
       onError:() => { setButtonState("error") }
    })

  const handleSubmit = () => {
    const formdata = new FormData()
    if(illnessDetails === '') return;
    formdata.append('typ', 'prolongedIllness');
    formdata.append('field', illnessDetails);
    reportMutation(formdata);
  };

  return (
    <MutltiLinetextInput label = 'Provide details about your prolonged illness'
    text={illnessDetails} setText={setIllnessDetails} isSuccces = {buttonState === "success"} isError={buttonState === "error"}
      handleSubmit={handleSubmit} isPending={isPending} />
  );
};

export default ProlongedIllness