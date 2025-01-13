import React from 'react';
import {Listbox} from '@headlessui/react';
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid';

const Dropdown = ({
                      label,
                      selected,
                      setSelected,
                      options,
                      excludeId,
                      dropdownWidthClasses,
                      openLeft,
                      circleColor = 'bg-blue-500', // Default to blue if no color is passed
                      specialUserId, // ID of the user accessed via the special link
                  }) => {
    // Filter out excluded IDs
    const filteredOptions = excludeId ? options.filter((option) => option.id !== excludeId) : options;

    // Ensure "No Comparison" is at the top, if present
    const sortedOptions = filteredOptions.sort((a, b) => {
        if (a.name === 'No Comparison') return -1; // Keep "No Comparison" at the top
        if (b.name === 'No Comparison') return 1;
        return a.name.localeCompare(b.name);
    });

    // Function to format the name as "First LastInitial."
    const formatName = (name) => {
        if (name === 'No Comparison') {
            return 'No Comparison'; // Abbreviated version of "No Comparison"
        }
        const [firstName, lastName] = name.split(' ');
        const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
        const formattedLastInitial = lastName ? `${lastName.charAt(0).toUpperCase()}.` : '';
        return `${formattedFirstName} ${formattedLastInitial}`.trim();
    };

    // Function to extract initials
    const getInitials = (name) => {
        if (name === 'No Comparison') {
            return ''; // No initials for "No Comparison"
        }
        const [firstName, lastName] = name.split(' ');
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
    };

    return (<div className="flex-1 w-1/2">
            <p className="text-sm text-gray-800 transition-all duration-300 sm:text-sm pb-2">
                {label}
            </p>
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-2">
                    {/* Button for displaying the selected option */}
                    <Listbox.Button
                        className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                       <span className="flex items-center">
                           {/* Circle with configurable color */}
                           <div
                               className={`h-6 w-6 flex-shrink-0 rounded-full ${selected?.name === 'No Comparison' ? 'bg-gray-500' : circleColor} flex items-center justify-center text-white font-semibold`}
                           >
                               {selected?.name ? getInitials(selected.name) : ''}
                           </div>
                           {/* Selected user's name - hidden on smaller screens */}
                           <span className="ml-3 block truncate sm:block text-nowrap	">
                               {selected ? formatName(selected.name) : 'No Comparison'}
                           </span>
                       </span>

                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>

                    {/* Dropdown options */}
                    <Listbox.Options
                        className={`absolute z-10 mt-1 ${openLeft ? 'left-auto right-0' : 'left-0'} ${dropdownWidthClasses} bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm w-[90vw]`}
                    >
                        {sortedOptions.map((option) => (<Listbox.Option
                                key={option.id}
                                className={({active}) => `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'text-white bg-blue-600' : 'text-gray-900'}`}
                                value={option}
                            >
                                {({selected, active}) => (<>
                                        <div className="flex items-center">
                                            {/* Circle with initials */}
                                            <div
                                                className={`h-6 w-6 flex-shrink-0 rounded-full ${option.name === 'No Comparison' ? 'bg-gray-500' : circleColor} flex items-center justify-center text-white font-semibold`}
                                            >
                                                {getInitials(option.name)}
                                            </div>
                                            <span
                                                className={`ml-3 block truncate ${selected ? 'font-semibold' : 'font-normal'} ${option.id === specialUserId ? 'text-red-500' // Special color for the user accessed via the special link
                                                    : ''}`}
                                            >
                                                {formatName(option.name)}
                                            </span>
                                        </div>
                                        {selected && (<span
                                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-blue-600'}`}
                                            >
                                                <CheckIcon
                                                    className="h-5 w-5"
                                                    aria-hidden="true"
                                                />
                                            </span>)}
                                    </>)}
                            </Listbox.Option>))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>);
};

export default Dropdown;
