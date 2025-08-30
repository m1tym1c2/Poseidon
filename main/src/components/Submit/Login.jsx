import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SUBMIT_URL = 'https://eventretrieval.one/api/v1/submit';
const LOGIN_URL = 'https://eventretrieval.one/api/v2/login';
const EVALUATION_URL = 'https://eventretrieval.one/api/v2/client/evaluation/list';
const userName = 'team31';
const password = 'V3xGcyNeuL';

const loginDres = async (setSessionId, setEvaluationId) => {
    const content = JSON.stringify({
      username: userName,
      password: password,
    });

    try {
      const res = await axios.post(LOGIN_URL, content, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.status !== 200) {
        console.log(res.data);
        toast.info(`Server response with status code ${res.status}`);
        return;
      }

      let data = res.data;
      console.log("session-id:", data.sessionId);
      setSessionId(data.sessionId);

      // Gọi tiếp API để lấy evaluationId
      const evaluationRes = await axios.get(EVALUATION_URL, {
        params: {
          session: data.sessionId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (evaluationRes.status !== 200) {
        console.log(evaluationRes.data);
        toast.info(`Failed to retrieve evaluation list with status ${evaluationRes.status}`);
        return;
      }

      const evaluationData = evaluationRes.data;
      if (evaluationData.length > 0) {
        const evaluationId = evaluationData[0].id; // Lấy evaluationId đầu tiên từ danh sách
        console.log("evaluation-id:", evaluationId);
        setEvaluationId(evaluationId);
      } else {
        toast.info('No evaluation data available');
      }

    } catch (err) {
      console.log("Error during login or fetching evaluation");
      console.error(err);
      toast.error(`Login or Evaluation Fetch Failed`);
    }
};

export default loginDres;
