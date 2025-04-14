import { View, Text } from 'react-native'
import React, { useState } from 'react';
import MutltiLinetextInput from '@/components/Patient/MutliLineTextInput';
import { useQueryClient,useMutation } from '@tanstack/react-query';
import { apiClient } from '@/hooks/api';


const LifeStyleChanges = () => {
  const [lifestylechanges, setLifeStyleChanges] = useState('');
  const [buttonState,setButtonState] = useState<'success' | 'error'  | 'default'>('default') 
  const queryclient= useQueryClient();

  

  const {mutate:reportMutation,isPending,isSuccess,isError} = useMutation({
    mutationFn: async(formdata:FormData) => {
      const result = await apiClient.post('/patient/report?typ=lifestylechanges',formdata,{
        headers:{'Content-Type': 'multipart/form-data'},
      })
      },
      onSuccess:() => {
        queryclient.invalidateQueries({queryKey:['reports']})
        setLifeStyleChanges('')
        setButtonState('success')
      },
      onError:() => {
        setButtonState('error')
      }
  })

  React.useEffect(() => {
      if (buttonState === 'success' || buttonState === 'error') {
        const timer = setTimeout(() => {
          setButtonState('default');
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess,isError,buttonState]);

  const handleSubmit = () => {
    const formdata = new FormData()
    if(lifestylechanges === '') return;
    formdata.append('field', lifestylechanges);
    reportMutation(formdata);
  };

  return (
    <MutltiLinetextInput label = 'Provide details about your LifeStyle Changes'
    text={lifestylechanges} setText={setLifeStyleChanges} isSuccces = {buttonState === "success"} isError={buttonState === "error"}
      handleSubmit={handleSubmit} isPending={isPending} />
  );
}

export default LifeStyleChanges