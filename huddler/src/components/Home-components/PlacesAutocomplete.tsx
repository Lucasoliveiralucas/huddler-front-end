import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

type Props = {
  hook: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
  setSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationName: React.Dispatch<React.SetStateAction<string>>;
};
type Description = {
  description: string;
};
const PlacesAutocomplete = ({ hook, setSelected, setLocationName }: Props) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    // Update the keyword of the input element
    setValue(e.currentTarget.value);
  };

  const handleSelect =
    ({ description }: Description) =>
    () => {
      setLocationName(description);
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        hook({ lat, lng });
        setSelected(true);
      });
      setValue("");
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          className="bg-white py-1 px-2 border-palette-light border-b-2 cursor-pointer"
        >
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <input
        className="py-1 pw-5 h-[40px] outline-none border-palette-orange border-b-2 placeholder: pl-2 w-[100%] shadow-md rounded-sm"
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Search"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && (
        <ul className="absolute shadow-sm rounded-sm">{renderSuggestions()}</ul>
      )}
    </div>
  );
};

export default PlacesAutocomplete;
