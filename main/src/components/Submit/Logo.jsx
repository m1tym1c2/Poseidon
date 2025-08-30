import submitDres from './Submit'
import loginDres from './Login'
import { useEffect, useState } from 'react'

const LogoBox = () => {
    const [sessionId, setSessionId] = useState('')
    const [evaluationId, setEvaluationId] = useState('')
    const [videoId, setVideoId] = useState('')
    const [frameTime, setFrameTime] = useState('')
    const [ans, setAns] = useState('')

    const submit = () => {
        console.log("-------------------------------------")
        console.log(sessionId, evaluationId, videoId, frameTime, ans)

        let body;
        if (ans) {
            // Body (QA): Tạo định dạng câu trả lời với "ANSWER-VIDEO_ID-FRAME_TIME"
            const answerQA = `${ans}-${videoId}-${frameTime}`;
            body = {
                answerSets: [{
                    answers: [{
                        text: answerQA
                    }]
                }]
            };
        } else {
            // Body (KIS): Gửi video và thông tin thời gian
            body = {
                answerSets: [{
                    answers: [{
                        mediaItemName: videoId,
                        start: parseInt(frameTime, 10), // Đảm bảo frameTime là số nguyên
                        end: parseInt(frameTime, 10) // Có thể thay đổi nếu cần thời gian kết thúc khác
                    }]
                }]
            };
        }

        // Gửi yêu cầu POST tới URL với session và evaluationId
        const url = `https://eventretrieval.one/api/v2/submit/${evaluationId}?session=${sessionId}`;
        
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body) // Không cần truyền thêm session, đã có trong URL
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 412) {
                    throw new Error('Precondition Failed: Missing required temporal information.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Kiểm tra nếu server trả về JSON
        })
        .then(data => {
            console.log("Success:", data);
        })
        .catch((error) => {
            console.error("Error:", error.message); // In ra lỗi chi tiết
        });
    }

    useEffect(() => {
        // Đăng nhập và lấy sessionId, evaluationId
        loginDres(setSessionId, setEvaluationId);
    }, [])

    return (
        <>
            <div>
                <input 
                    type="text" 
                    placeholder="Video ID" 
                    value={videoId} 
                    onChange={(e) => setVideoId(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Frame Time (ms)" 
                    value={frameTime} 
                    onChange={(e) => setFrameTime(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Answer (optional)" 
                    value={ans} 
                    onChange={(e) => setAns(e.target.value)} 
                />
                <div className="h-12" onClick={submit}>
                    <img className="h-full w-full" src='../../../logo.webp' alt="Logo"/>
                </div>
            </div>
        </>
    )
}

export default LogoBox;
