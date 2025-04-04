import React, { useState } from 'react';
import MutltiLinetextInput from '@/components/Patient/MutliLineTextInput';
import { useQueryClient,useMutation } from '@tanstack/react-query';
import { apiClient } from '@/hooks/api';


const OtherMedication = () => {
  const [medications, setMedications] = useState('');
  const queryclient = useQueryClient();

  const {mutate:reportMutation,isPending} = useMutation({
     mutationFn: async(formdata:FormData) => {
        const result = await apiClient.post('/patient/report',formdata,{
           headers:{'Content-Type': 'multipart/form-data'},
        })
     },
     onSuccess:() => {
        queryclient.invalidateQueries({queryKey:['reports']})
     }
  })

  const handleSubmit = () => {
    const formdata = new FormData()
    if(medications === '') return;
    formdata.append('typ', 'otherMedication');
    formdata.append('field', medications);
    reportMutation(formdata);
  };

  return (
      <MutltiLinetextInput label='List the names of other medications you are taking'
      text={medications} setText={setMedications} 
      handleSubmit={handleSubmit} isPending={isPending}/>
  );
};


export default OtherMedication;