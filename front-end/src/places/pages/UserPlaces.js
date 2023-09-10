import { useParams } from "react-router";
import { useState, useEffect } from "react";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useHttpClient } from '../../shared/hooks/http-hook';

const UserPlaces = () => { 
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlaces, setLoadedUsers] = useState();

    const userId = useParams().userId;


    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:8000/api/places/user/${userId}`);
                setLoadedUsers(responseData.places);
            } catch (err) { 

            }  
        };
        fetchPlaces();
    }, [sendRequest, userId]);

    const placeDeletedHandler = (deletedPlaceId) => { 
        setLoadedUsers((prevPlaces) => { return prevPlaces.filter((place) => { return place._id !== deletedPlaceId }) });
    };



    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </>
    );
};

export default UserPlaces;