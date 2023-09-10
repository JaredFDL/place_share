import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import PlaceItem from './PlaceItem';
import './PlaceList.css';


const PlaceList = (props) => {
    
    if (props.items.length === 0) {
        return (
          <div className="place-list center">
            <Card>
              <h2>No places found. Maybe create one?</h2>
              <Button to="/places/new">Share Place</Button>
            </Card>
          </div>
        );
    }

    return (
        <ul className='place-list'>
            {props.items && props.items.map(item => (
                <PlaceItem
                    key={item._id}
                    id={item._id}
                    image={item.image}
                    title={item.title}
                    description={item.description}
                    address={item.address}
                    creatorId={item.creator}
                    coordinates={item.location}
                    onDelete={props.onDeletePlace}
                />
            ))}
        </ul>
    );
}

export default PlaceList;