import { useState, useContext, React } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

import './PlaceItem.css';

const PlaceItem = (props) => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    const [showConfirm, setShowComfirm] = useState(false);

    const showDeleteWarningHandler = () => { 
        setShowComfirm(true);
    };

    const cancelDeleteHandler = () => { 
        setShowComfirm(false);
    };

    const confirmDeleteHandler = async () => { 
        setShowComfirm(false);
        try { 
            await sendRequest(
                `http://localhost:8000/api/places/${props.id}`,
                'DELETE'
            );
            props.onDelete(props.id);
        } catch (err) {}
       
    };

    const [showMap, setShowMap] = useState(false);

    const openMapHandler = () => {
        setShowMap(true);
    };

    const closeMapHandler = () => {
        setShowMap(false);
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Modal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button onClick={closeMapHandler}>Close</Button>}
            >
                <div className='map-container'>
                    <Map center={props.coordinates} zoom={18} />
                </div>
            </Modal>

            <Modal show={showConfirm} onCancel={cancelDeleteHandler} header='Delete confirmation' footerClass='place-item__modal-actions' footer={ 
                <>
                    <Button onClick={cancelDeleteHandler} inverse>Cancel</Button>
                    <Button onClick={confirmDeleteHandler} danger>Delete</Button>
                </>
            }>
                <p>Delete operation can not be undone. Are you going to proceed?</p>
            </Modal>

            <li className='place-item'>
                <Card className='place-item__content'>
                    {isLoading && <LoadingSpinner asOverlay />}
                    <div className='place-item__image'>
                        <img src={`http://localhost:8000/${props.image}`} alt={props.title} />
                    </div>
                    <div className='place-item__info'>
                        <h2>{props.title}</h2>
                        <h3>{props.address}</h3>
                        <p>{props.description}</p>
                    </div>
                    <div className='place-item__actions'>
                        <Button inverse onClick={openMapHandler}>View on map</Button>
                        { auth.userId === props.creatorId && (<Button to={`/places/${props.id}`}>Edit</Button>)}
                        { auth.userId === props.creatorId && (<Button onClick={showDeleteWarningHandler} danger>Delete</Button>)}                      
                    </div>
                </Card>   
            </li>
        </>
    );
}

export default PlaceItem;