import React, {useEffect, useState} from 'react';
import Axios from "axios";
import {useSelector} from "react-redux";

function Subscribe(props) {
    const userFrom = localStorage.getItem('userId')

    const [SubscribeNumber, setSubscribeNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(() => {

        let variable = {userTo: props.userTo}
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수를 가져오지 못했습니다.')
                }
            })

        let subscribedVariable = {userTo: props.userTo, userFrom: userFrom}
        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed)
                } else {
                    alert('정보를 받아오지 못했습니다.')
                }
            })
    }, [])

    const onSubscribe = () => {

        let subscribeVariable = {
            userTo: props.userTo,
            userFrom: userFrom
        }

        if(Subscribed) {
            Axios.post('/api/subscribe/unsubscribe', subscribeVariable)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 취소 실패.')
                    }
                })
        } else {
            Axios.post('/api/subscribe/subscribe', subscribeVariable)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 실패.')
                    }
                })
        }
    }

    return (
        <div
            style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px',
                color: '#fff', padding: '10px 16px',
                fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}
            onClick={onSubscribe}
        >
            {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
        </div>
    );
}

export default Subscribe;