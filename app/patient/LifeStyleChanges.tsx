import { View, Text } from 'react-native'
import React, { useState } from 'react';
import MutltiLinetextInput from '@/components/Patient/MutliLineTextInput';
import { useQueryClient,useMutation } from '@tanstack/react-query';
import { apiClient } from '@/hooks/api';


const LifeStyleChanges = () => {
  const [lifestylechanges, setLifeStyleChanges] = useState(''); 
  const queryclient= useQueryClient();

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
    if(lifestylechanges === '') return;
    formdata.append('typ', 'lifestyleChanges');
    formdata.append('field', lifestylechanges);
    reportMutation(formdata);
  };

  return (
    <MutltiLinetextInput label = 'Provide details about your LifeStyle Changes'
    text={lifestylechanges} setText={setLifeStyleChanges} 
      handleSubmit={handleSubmit} isPending={isPending} />
  );
}

export default LifeStyleChanges