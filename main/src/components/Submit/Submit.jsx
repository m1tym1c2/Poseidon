import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// const SUBMIT_URL = 'https://eventretrieval.one/api/v1/submit';
  const submitDres = async (
    video_id,
    frame_id,
    session,
  ) => {
    const int_frame_id=parseInt(frame_id,10)
    console.log(int_frame_id)
    const params={
        item: video_id,
        frame: int_frame_id,
        session: session,
      }
    console.log(params)
    try {
      const res = await axios.get('https://eventretrieval.one/api/v1/submit', {
        params: params,
        withCredentials: true,
        validateStatus: (status) => status === 200 || status === 404,
      });

      if (res.status !== 200 && res.status !== 404) {
        toast.info(`Server response with status code ${res.status}`);
        return;
      }

      let data = res.data;

      if (!data.status) {
        toast.warning(`Submit false with description: ${data.description}`);
        return;
      }

      if (data.submission === 'WRONG') {
        toast.error(`Submit WORNG with description: ${data.description}`);
        return;
      }

      toast.success(`Submission success`);
    } catch (err) {
      console.error(err);
      toast.error(`${err} in submission`);
    }
  };

export default submitDres;