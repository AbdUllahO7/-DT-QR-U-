import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Upload,
  X,
  Globe,
  Home,
  Info,
  Clock,
  MapPinned,
  ArrowLeft,
  ArrowRight,
  Navigation,
  Trash2,
  Image as ImageIcon,
  ChevronDown,
  Search,
  Check,
  Plus
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { CreateBranchWithDetailsDto, CreateBranchWorkingHourCoreDto } from '../../../../types/api';
import { mediaService } from '../../../../services/mediaService';
import { countriesWithCodes, countryKeys } from '../../../../data/mockData';
import { TranslatableFieldValue } from '../../../../hooks/useTranslatableFields';

// --- IMPORT MULTI-LANGUAGE COMPONENTS ---
import { MultiLanguageInput } from '../../../common/MultiLanguageInput';
import { MultiLanguageTextArea } from '../../../common/MultiLanguageTextArea';
import { LanguageFormControl } from '../../../common/LanguageFormControl';

// --- LEAFLET IMPORTS & SETUP ---
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for Leaflet default icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// --- Custom Select Component (Matches BranchEditModal) ---
interface CustomSelectProps {
  options: { label: string; value: string; searchTerms?: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.searchTerms?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors focus:ring-2 focus:ring-blue-500 ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {icon}
          <span className="truncate block text-sm">
            {selectedOption ? selectedOption.label : <span className="text-gray-500">{placeholder}</span>}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col"
          >
            <div className="p-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-1.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white`}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-4 py-2 text-sm text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      value === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{option.label}</span>
                    {value === option.value && <Check className="w-4 h-4" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">No results found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface LanguageOption {
  code: string;
  displayName: string;
  nativeName: string;
  isRtl: boolean;
}

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBranchWithDetailsDto) => Promise<void>;
  formData: CreateBranchWithDetailsDto;
  setFormData: React.Dispatch<React.SetStateAction<CreateBranchWithDetailsDto>>;
  isSubmitting: boolean;
  hasChanges?: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onWorkingHourChange: (dayIndex: number, field: keyof CreateBranchWorkingHourCoreDto, value: any) => void;
  
  // Translation Props
  supportedLanguages: LanguageOption[];
  branchNameTranslations: TranslatableFieldValue;
  setBranchNameTranslations: React.Dispatch<React.SetStateAction<TranslatableFieldValue>>;
  contactHeaderTranslations: TranslatableFieldValue;
  setContactHeaderTranslations: React.Dispatch<React.SetStateAction<TranslatableFieldValue>>;
  footerTitleTranslations: TranslatableFieldValue;
  setFooterTitleTranslations: React.Dispatch<React.SetStateAction<TranslatableFieldValue>>;
  footerDescriptionTranslations: TranslatableFieldValue;
  setFooterDescriptionTranslations: React.Dispatch<React.SetStateAction<TranslatableFieldValue>>;
  openTitleTranslations: TranslatableFieldValue;
  setOpenTitleTranslations: React.Dispatch<React.SetStateAction<TranslatableFieldValue>>;
  openDaysTranslations: TranslatableFieldValue;
  setOpenDaysTranslations: React.Dispatch<React.SetStateAction<TranslatableFieldValue>>;
  openHoursTranslations: TranslatableFieldValue;
  setOpenHoursTranslations: React.Dispatch<React.SetStateAction<TranslatableFieldValue>>;
}

const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isSubmitting,
  onInputChange,
  onWorkingHourChange,
  supportedLanguages,
  branchNameTranslations,
  setBranchNameTranslations,
  contactHeaderTranslations,
  setContactHeaderTranslations,
  footerTitleTranslations,
  setFooterTitleTranslations,
  footerDescriptionTranslations,
  setFooterDescriptionTranslations,
  openTitleTranslations,
  setOpenTitleTranslations,
  openDaysTranslations,
  setOpenDaysTranslations,
  openHoursTranslations,
  setOpenHoursTranslations
}) => {
  const { t, language } = useLanguage();
  const defaultLanguage = 'en';
  const isRTL = language === 'ar';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [branchLogo, setBranchLogo] = useState<File | null>(null);
  const [branchLogoPreview, setBranchLogoPreview] = useState<string | null>(formData.branchLogoPath || null);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState<boolean>(false);
  const [selectedFormLanguage, setSelectedFormLanguage] = useState<string>(defaultLanguage);
  
  // --- MAP STATE ---
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number; lng: number }>({
    lat: 41.0082, // Default to Istanbul
    lng: 28.9784
  });
  const [googleMapsLink, setGoogleMapsLink] = useState<string>('');
  const [linkError, setLinkError] = useState<string>('');

  const dayNamesDisplay = Array.isArray(t('branchModal.workingHours.days'))
    ? t('branchModal.workingHours.days')
    : language === 'ar'
    ? ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    setBranchLogoPreview(formData.branchLogoPath || null);
  }, [formData.branchLogoPath]);

  useEffect(() => {
    setIsCurrentStepValid(checkStepValidity(currentStep));
  }, [formData, currentStep]);

  const formatTimeForInput = (timeStr: string): string => {
    return timeStr ? timeStr.substring(0, 5) : '00:00';
  };

  const formatTimeForApi = (timeStr: string): string => {
    return `${timeStr}:00`;
  };

  const getPhoneParts = (fullNumber: string | null) => {
    if (!fullNumber) return { code: '+90', number: '' }; 
    const sortedCountries = [...countriesWithCodes].sort((a, b) => b.code.length - a.code.length);
    const country = sortedCountries.find(c => fullNumber.startsWith(c.code));
    if (country) {
      return { code: country.code, number: fullNumber.slice(country.code.length) };
    }
    return { code: '+90', number: fullNumber };
  };

  // Prepare options for custom select
  const countryCodeOptions = countriesWithCodes.map(c => ({
    label: `${c.name} (${c.code})`,
    value: c.code,
    searchTerms: c.name
  }));

  const countryNameOptions = countryKeys.map(key => ({
    label: t(key),
    value: t(key),
    searchTerms: key
  }));

  const Toggle = ({ checked, onChange, disabled }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? (isRTL ? '-translate-x-6' : 'translate-x-6') : (isRTL ? '-translate-x-1' : 'translate-x-1')
        }`}
      />
    </button>
  );

  const checkStepValidity = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          !!formData.branchName?.trim() &&
          !!formData.whatsappOrderNumber?.trim()
        );
      case 2:
        return (
          !!formData.createAddressDto.city?.trim() &&
          !!formData.createAddressDto.country?.trim()
        );
      case 3:
        return (
          !!formData.createContactDto.phone?.trim() &&
          !!formData.createContactDto.mail?.trim()
        );
      default:
        return false;
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.branchName?.trim()) {
        errors.branchName = t('branchModal.errors.branchName');
      }
      if (!formData.whatsappOrderNumber?.trim()) {
        errors.whatsappOrderNumber = t('branchModal.errors.whatsappNumber');
      }
    } else if (step === 2) {
      if (!formData.createAddressDto.city?.trim()) {
        errors['address.city'] = t('branchModal.errors.city') || 'City is required';
      }
      if (!formData.createAddressDto.country?.trim()) {
        errors['address.country'] = t('branchModal.errors.country') || 'Country is required';
      }
    } else if (step === 3) {
      if (!formData.createContactDto.phone?.trim()) {
        errors['contact.phone'] = t('branchModal.errors.phone') || 'Phone is required';
      }
      if (!formData.createContactDto.mail?.trim()) {
        errors['contact.mail'] = t('branchModal.errors.email') || 'Email is required';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedFormData: CreateBranchWithDetailsDto;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      updatedFormData = {
        ...formData,
        createAddressDto: {
          ...formData.createAddressDto,
          [addressField]: value
        }
      };
    } else if (name.startsWith('contact.')) {
      const contactField = name.split('.')[1];
      updatedFormData = {
        ...formData,
        createContactDto: {
          ...formData.createContactDto,
          [contactField]: value
        }
      };
    } else {
      updatedFormData = {
        ...formData,
        [name]: value
      };
    }

    setFormData(updatedFormData);

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    onInputChange(e);
  };

  const handlePhoneCompositeChange = (
    fullFieldName: string, 
    currentFullValue: string | null, 
    partType: 'code' | 'number', 
    newValue: string
  ) => {
    if (partType === 'number') {
      if (!/^\d*$/.test(newValue)) return;
      if (newValue.length > 15) return;
    }

    const { code, number } = getPhoneParts(currentFullValue);
    let newFullNumber = '';
    
    if (partType === 'code') {
      newFullNumber = newValue + number;
    } else {
      newFullNumber = code + newValue;
    }

    const syntheticEvent = {
      target: {
        name: fullFieldName,
        value: newFullNumber,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(syntheticEvent);
  };

  const handleWorkingHourChange = (dayIndex: number, field: keyof CreateBranchWorkingHourCoreDto, value: any) => {
    if (!formData.createBranchWorkingHourCoreDto) return;

    const updatedFormData = {
      ...formData,
      createBranchWorkingHourCoreDto: formData.createBranchWorkingHourCoreDto.map((day, index) => {
        if (index !== dayIndex) return day;

        // Handle special cases for backend validation rules
        if (field === 'isWorkingDay') {
          if (!value) {
            // Non-working days cannot have time slots
            return { ...day, isWorkingDay: value, timeSlots: [], isOpen24Hours: false };
          } else {
            // When enabling working day, add default time slot if none exists
            return {
              ...day,
              isWorkingDay: value,
              timeSlots: day.timeSlots?.length ? day.timeSlots : [{ openTime: '08:00:00', closeTime: '22:00:00' }]
            };
          }
        }

        if (field === 'isOpen24Hours') {
          if (value) {
            // 24-hour open days cannot have time slots
            return { ...day, isOpen24Hours: value, timeSlots: [] };
          } else {
            // When disabling 24 hours, add default time slot
            return { ...day, isOpen24Hours: value, timeSlots: [{ openTime: '08:00:00', closeTime: '22:00:00' }] };
          }
        }

        return { ...day, [field]: value };
      })
    };

    setFormData(updatedFormData);
    onWorkingHourChange(dayIndex, field, value);
  };

  const handleTimeSlotChange = (dayIndex: number, slotIndex: number, field: 'openTime' | 'closeTime', value: string) => {
    if (!formData.createBranchWorkingHourCoreDto) return;

    const updatedFormData = {
      ...formData,
      createBranchWorkingHourCoreDto: formData.createBranchWorkingHourCoreDto.map((day, index) => {
        if (index !== dayIndex) return day;
        const newTimeSlots = [...(day.timeSlots || [])];
        if (newTimeSlots[slotIndex]) {
          newTimeSlots[slotIndex] = { ...newTimeSlots[slotIndex], [field]: formatTimeForApi(value) };
        }
        return { ...day, timeSlots: newTimeSlots };
      })
    };

    setFormData(updatedFormData);
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    if (!formData.createBranchWorkingHourCoreDto) return;

    const updatedFormData = {
      ...formData,
      createBranchWorkingHourCoreDto: formData.createBranchWorkingHourCoreDto.map((day, index) => {
        if (index !== dayIndex) return day;
        const newTimeSlots = [...(day.timeSlots || []), { openTime: '08:00:00', closeTime: '22:00:00' }];
        return { ...day, timeSlots: newTimeSlots };
      })
    };

    setFormData(updatedFormData);
  };

  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    if (!formData.createBranchWorkingHourCoreDto) return;

    const updatedFormData = {
      ...formData,
      createBranchWorkingHourCoreDto: formData.createBranchWorkingHourCoreDto.map((day, index) => {
        if (index !== dayIndex) return day;
        const newTimeSlots = (day.timeSlots || []).filter((_, i) => i !== slotIndex);
        return { ...day, timeSlots: newTimeSlots };
      })
    };

    setFormData(updatedFormData);
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      setBranchLogo(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setBranchLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      await handleLogoUpload(file);
    }
  };

  const handleLogoUpload = async (file?: File): Promise<void> => {
    const uploadFile = file || branchLogo;
    if (!uploadFile) return;

    setIsUploadingLogo(true);
    try {
      const responseUrl = await mediaService.uploadFile(uploadFile);

      setFormData(prev => ({
        ...prev,
        branchLogoPath: responseUrl
      }));
      setBranchLogo(null);
    } catch (error) {
      console.error('Logo upload error:', error);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveImage = () => {
    setBranchLogoPreview(null);
    setFormData(prev => ({ ...prev, branchLogoPath: null }));
  };

  const handleNextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }

    const submissionData = {
      ...formData,
      branchLogoPath: formData.branchLogoPath || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/330px-No_image_available.svg.png'
    };

    await onSubmit(submissionData);
  };

  // Bulk fill all fields from default language to selected language
  const handleBulkFillLanguage = (targetLanguage: string) => {
    if (targetLanguage === defaultLanguage || !targetLanguage) return;

    // Copy all default language values to target language
    if (branchNameTranslations[defaultLanguage]) {
      setBranchNameTranslations(prev => ({ ...prev, [targetLanguage]: prev[defaultLanguage] }));
    }
    if (contactHeaderTranslations[defaultLanguage]) {
      setContactHeaderTranslations(prev => ({ ...prev, [targetLanguage]: prev[defaultLanguage] }));
    }
    if (footerTitleTranslations[defaultLanguage]) {
      setFooterTitleTranslations(prev => ({ ...prev, [targetLanguage]: prev[defaultLanguage] }));
    }
    if (footerDescriptionTranslations[defaultLanguage]) {
      setFooterDescriptionTranslations(prev => ({ ...prev, [targetLanguage]: prev[defaultLanguage] }));
    }
    if (openTitleTranslations[defaultLanguage]) {
      setOpenTitleTranslations(prev => ({ ...prev, [targetLanguage]: prev[defaultLanguage] }));
    }
    if (openDaysTranslations[defaultLanguage]) {
      setOpenDaysTranslations(prev => ({ ...prev, [targetLanguage]: prev[defaultLanguage] }));
    }
    if (openHoursTranslations[defaultLanguage]) {
      setOpenHoursTranslations(prev => ({ ...prev, [targetLanguage]: prev[defaultLanguage] }));
    }
  };

  // Function to extract coordinates from Google Maps link
  const extractCoordinatesFromLink = (link: string): { lat: number; lng: number } | null => {
    try {
      const pattern1 = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
      const match1 = link.match(pattern1);
      if (match1) return { lat: parseFloat(match1[1]), lng: parseFloat(match1[2]) };

      const pattern2 = /q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
      const match2 = link.match(pattern2);
      if (match2) return { lat: parseFloat(match2[1]), lng: parseFloat(match2[2]) };

      const pattern3 = /place\/[^@]*@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
      const match3 = link.match(pattern3);
      if (match3) return { lat: parseFloat(match3[1]), lng: parseFloat(match3[2]) };

      const pattern4 = /!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/;
      const match4 = link.match(pattern4);
      if (match4) return { lat: parseFloat(match4[1]), lng: parseFloat(match4[2]) };

      return null;
    } catch (error) {
      console.error('Error extracting coordinates:', error);
      return null;
    }
  };

  const handleGoogleMapsLinkChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const link = e.target.value;
    setGoogleMapsLink(link);
    setLinkError('');

    if (link.trim()) {
      const coords = extractCoordinatesFromLink(link);
      if (coords) {
        setSelectedLatLng(coords);
        setLinkError('');
      } else if (link.includes('google.com/maps') || link.includes('maps.app.goo.gl')) {
        setLinkError(t('onboardingBranch.form.step3.location.invalidLink') || 'Could not extract coordinates from this link. Please try a different format.');
      }
    }
  };

  const handleGetCurrentLocation = (): void => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSelectedLatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(t('onboardingBranch.form.step3.location.geolocationError') || 'Could not get your location. Please select manually.');
        }
      );
    } else {
      alert(t('onboardingBranch.form.step3.location.geolocationNotSupported') || 'Geolocation is not supported by your browser.');
    }
  };

  // --- MAP HANDLERS ---
  const handleOpenMapModal = (): void => {
    if (formData.createContactDto.location) {
      try {
        const [lat, lng] = formData.createContactDto.location.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          setSelectedLatLng({ lat, lng });
        }
      } catch (error) {
        console.error('Failed to parse location', error);
      }
    }
    setGoogleMapsLink('');
    setLinkError('');
    setIsMapModalOpen(true);
  };

  const handleCloseMapModal = (): void => {
    setIsMapModalOpen(false);
  };

  const handleConfirmLocation = (): void => {
    const locationString = `${selectedLatLng.lat.toFixed(6)},${selectedLatLng.lng.toFixed(6)}`;

    setFormData(prev => ({
      ...prev,
      createContactDto: {
        ...prev.createContactDto,
        location: locationString
      }
    }));

    // Synthetic event to update parent state/validation
    const syntheticEvent = {
        target: {
          name: 'contact.location',
          value: locationString,
        },
      } as React.ChangeEvent<HTMLInputElement>;
    onInputChange(syntheticEvent);

    setIsMapModalOpen(false);
  };

  // --- MAP SUB-COMPONENTS ---
  const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
  };

  const LocationMarker: React.FC = () => {
    useMapEvents({
      click(e) {
        setSelectedLatLng({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });
    return <Marker position={[selectedLatLng.lat, selectedLatLng.lng]} />;
  };

  const MapPickerModal = () => {
    useEffect(() => {
      if (isMapModalOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
      return () => { document.body.style.overflow = 'unset'; };
    }, [isMapModalOpen]);

    if (!isMapModalOpen) return null;

    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-[9999] overflow-y-auto" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseMapModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <MapPin className="h-6 w-6 text-primary-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t('onboardingBranch.form.step3.location.mapTitle')}
                  </h3>
                </div>
                <button
                  onClick={handleCloseMapModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Google Maps Link Input */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('onboardingBranch.form.step3.location.googleMapsLink') || 'Google Maps Link (optional)'}
                  </label>
                  <div className="relative">
                    <Globe className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                    <input
                      type="text"
                      value={googleMapsLink}
                      onChange={handleGoogleMapsLinkChange}
                      placeholder={t('onboardingBranch.form.step3.location.googleMapsLinkPlaceholder') || 'https://maps.google.com/...'}
                      className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border ${
                        linkError ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                      } rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isRTL ? 'text-right' : 'text-left'}`}
                      dir="ltr"
                    />
                  </div>
                  {linkError && (
                    <p className={`text-xs text-red-600 dark:text-red-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {linkError}
                    </p>
                  )}
                  <p className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('onboardingBranch.form.step3.location.googleMapsLinkHelper') || 'Paste a Google Maps link and coordinates will be extracted automatically'}
                  </p>
                </div>

                {/* Current Location Button */}
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200 border border-blue-200 dark:border-blue-700 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <Navigation className="h-5 w-5" />
                  <span className="font-medium">
                    {t('onboardingBranch.form.step3.location.useCurrentLocation') || 'Use my current location'}
                  </span>
                </button>

                {/* Interactive Map Container */}
                <div className="space-y-2">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <label className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('onboardingBranch.form.step3.location.interactiveMap') || 'Interactive Map'}
                    </label>
                    <span className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('onboardingBranch.form.step3.location.clickToPin') || 'Click on the map to pin location'}
                    </span>
                  </div>
                  <div className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600 shadow-inner">
                    <MapContainer
                      center={[selectedLatLng.lat, selectedLatLng.lng]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapUpdater center={[selectedLatLng.lat, selectedLatLng.lng]} />
                      <LocationMarker />
                    </MapContainer>

                    {/* Overlay with instructions */}
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
                      <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary-600" />
                          {t('onboardingBranch.form.step3.location.markerPosition') || 'Marker position'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* External Map Link */}
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selectedLatLng.lat}&mlon=${selectedLatLng.lng}#map=15/${selectedLatLng.lat}/${selectedLatLng.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span>{t('onboardingBranch.form.step3.location.openFullMap') || 'Open in full map'}</span>
                    <ArrowRight className={`h-3 w-3 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
                  </a>
                </div>

                {/* Coordinate Inputs */}
                <div className="space-y-3">
                  <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('onboardingBranch.form.step3.location.manualCoordinates') || 'Manual Coordinates'}
                  </label>
                  <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div>
                      <label className={`block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('onboardingBranch.form.step3.location.latitude') || 'Latitude'}
                      </label>
                      <input
                        title='number'
                        type="number"
                        step="0.000001"
                        value={selectedLatLng.lat}
                        onChange={(e) => {
                          const newLat = parseFloat(e.target.value) || 0;
                          if (newLat >= -90 && newLat <= 90) {
                            setSelectedLatLng(prev => ({ ...prev, lat: newLat }));
                          }
                        }}
                        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isRTL ? 'text-right' : 'text-left'}`}
                        dir="ltr"
                        min="-90"
                        max="90"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('onboardingBranch.form.step3.location.longitude') || 'Longitude'}
                      </label>
                      <input
                        title='number2'
                        type="number"
                        step="0.000001"
                        value={selectedLatLng.lng}
                        onChange={(e) => {
                          const newLng = parseFloat(e.target.value) || 0;
                          if (newLng >= -180 && newLng <= 180) {
                            setSelectedLatLng(prev => ({ ...prev, lng: newLng }));
                          }
                        }}
                        className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isRTL ? 'text-right' : 'text-left'}`}
                        dir="ltr"
                        min="-180"
                        max="180"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
                  <div className={`flex items-start space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className={`text-sm text-blue-700 dark:text-blue-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="font-medium mb-2">
                        {t('onboardingBranch.form.step3.location.mapHelp') || 'How to use the map:'}
                      </p>
                      <ul className={`space-y-1.5 ${isRTL ? 'mr-4' : 'ml-4'}`}>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">1.</span>
                          <span>{t('onboardingBranch.form.step3.location.mapHelp1') || 'Paste a Google Maps link in the field above'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">2.</span>
                          <span>{t('onboardingBranch.form.step3.location.mapHelp2') || 'Or click "Use my current location"'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">3.</span>
                          <span>{t('onboardingBranch.form.step3.location.mapHelp3') || 'Or enter coordinates manually'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">4.</span>
                          <span>{t('onboardingBranch.form.step3.location.mapHelp4') || 'Click on the map to pin your exact location'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Current Selected Coordinates Display */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t('onboardingBranch.form.step3.location.selectedCoordinates') || 'Selected Coordinates:'}
                    </span>
                    <code className="text-sm font-mono text-primary-600 dark:text-primary-400" dir="ltr">
                      {selectedLatLng.lat.toFixed(6)}, {selectedLatLng.lng.toFixed(6)}
                    </code>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`flex ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} space-x-3 p-6 border-t border-gray-200 dark:border-gray-700`}>
                <button
                  type="button"
                  onClick={handleCloseMapModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLocation}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {t('common.save')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('branchModal.sections.basicInfo')}
        </h4>
        <div className="space-y-6">

          <div>
             <MultiLanguageInput
                label={t('branchModal.fields.branchName.label')}
                value={branchNameTranslations}
                onChange={(newTranslations) => {
                  setBranchNameTranslations(newTranslations);
                  // Update base DTO with current/default language value for validation
                  const val = newTranslations[language] || newTranslations[defaultLanguage] || '';

                  // Update main formData
                  setFormData(prev => ({ ...prev, branchName: val }));

                  // Clear error if exists
                  if (formErrors.branchName && val) {
                    setFormErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.branchName;
                      return newErrors;
                    });
                  }
                }}
                languages={supportedLanguages}
                placeholder={t('branchModal.fields.branchName.placeholder')}
                required={false} // Enforces default language requirement
                defaultLanguage={defaultLanguage}
                selectedLanguage={selectedFormLanguage}
                showLanguageSelector={false}
              />
              {formErrors.branchName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.branchName}</p>
              )}
          </div>

          <div>
            <label htmlFor="whatsappOrderNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.whatsappNumber.label')} *
            </label>
            
            <div className={`flex flex-col sm:flex-row gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="w-full sm:w-1/3 md:w-1/4">
                <CustomSelect
                    options={countryCodeOptions}
                    value={getPhoneParts(formData.whatsappOrderNumber).code}
                    onChange={(newCode) => handlePhoneCompositeChange(
                      'whatsappOrderNumber',
                      formData.whatsappOrderNumber,
                      'code',
                      newCode
                    )}
                    placeholder="Code"
                  />
              </div>
              <input
                type="tel"
                maxLength={15}
                value={getPhoneParts(formData.whatsappOrderNumber).number}
                onChange={(e) => handlePhoneCompositeChange(
                  'whatsappOrderNumber', 
                  formData.whatsappOrderNumber, 
                  'number', 
                  e.target.value
                )}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ${
                  formErrors.whatsappOrderNumber
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('branchModal.fields.whatsappNumber.placeholder')}
              />
            </div>

            {formErrors.whatsappOrderNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.whatsappOrderNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.branchLogo.label')}
            </label>
            <div className="space-y-4">
               {branchLogoPreview && (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <img
                      src={branchLogoPreview}
                      alt="Branch Logo"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                    />
                    {!isUploadingLogo && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <input
                  type="file"
                  id="branchLogo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  disabled={isUploadingLogo}
                />
                <label
                  htmlFor="branchLogo"
                  className={`inline-flex items-center px-4 py-2 border rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 ${
                    isUploadingLogo ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  } border-gray-300 dark:border-gray-600`}
                >
                  {isUploadingLogo ? (
                    <>
                      <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                      {t('branchModal.fields.branchLogo.uploading')}
                    </>
                  ) : (
                    <>
                      <Upload className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {branchLogoPreview ? t('branchManagement.form.logoChange') : t('branchManagement.form.logoUpload')}
                    </>
                  )}
                </label>
                
                {!branchLogoPreview && !isUploadingLogo && (
                  <div className={`flex items-center text-gray-400 dark:text-gray-500 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-sm">{t('branchManagement.form.logoNotSelected')}</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('branchModal.fields.branchLogo.supportText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('branchModal.sections.addressInfo')}
        </h4>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('branchModal.fields.country.label')} <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                options={countryNameOptions}
                value={formData.createAddressDto.country || ''}
                onChange={(newCountry) => {
                  const syntheticEvent = {
                    target: {
                      name: 'address.country',
                      value: newCountry,
                    },
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleInputChange(syntheticEvent);
                }}
                placeholder={t('branchModal.fields.country.placeholder')}
                icon={<Globe className="h-5 w-5 text-gray-400" />}
              />
              {formErrors['address.country'] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.country']}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('branchModal.fields.city.label')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                <input
                  type="text"
                  id="city"
                  name="address.city"
                  value={formData.createAddressDto.city || ''}
                  onChange={handleInputChange}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border ${formErrors['address.city'] ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('branchModal.fields.city.placeholder')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              {formErrors['address.city'] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['address.city']}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.street.label')}
            </label>
            <div className="relative">
              <MapPinned className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
              <input
                type="text"
                id="street"
                name="address.street"
                value={formData.createAddressDto.street || ''}
                onChange={handleInputChange}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('branchModal.fields.street.placeholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('branchModal.fields.zipCode.label')}
              </label>
              <div className="relative">
                <div className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 flex items-center justify-center`}>
                  <span className="text-gray-400 font-bold text-xs">#</span>
                </div>
                <input
                  type="text"
                  id="zipCode"
                  name="address.zipCode"
                  value={formData.createAddressDto.zipCode || ''}
                  onChange={handleInputChange}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('branchModal.fields.zipCode.placeholder')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('branchModal.fields.addressLine1.label')}
              </label>
              <div className="relative">
                <Home className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                <input
                  type="text"
                  id="addressLine1"
                  name="address.addressLine1"
                  value={formData.createAddressDto.addressLine1 || ''}
                  onChange={handleInputChange}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('branchModal.fields.addressLine1.placeholder')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.addressLine2.label')}
            </label>
            <div className="relative">
              <Home className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
              <input
                type="text"
                id="addressLine2"
                name="address.addressLine2"
                value={formData.createAddressDto.addressLine2 || ''}
                onChange={handleInputChange}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t('branchModal.fields.addressLine2.placeholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t('branchModal.sections.contactInfo')}
        </h4>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('branchModal.fields.phone.label')} <span className="text-red-500">*</span>
              </label>

              <div className={`flex flex-col sm:flex-row gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <div className="w-full sm:w-1/3">
                  <CustomSelect
                    options={countryCodeOptions}
                    value={getPhoneParts(formData.createContactDto.phone).code}
                    onChange={(newCode) => handlePhoneCompositeChange(
                      'contact.phone',
                      formData.createContactDto.phone,
                      'code',
                      newCode
                    )}
                    placeholder="Code"
                  />
                </div>
                <input
                  type="tel"
                  maxLength={15}
                  value={getPhoneParts(formData.createContactDto.phone).number}
                  onChange={(e) => handlePhoneCompositeChange(
                    'contact.phone',
                    formData.createContactDto.phone,
                    'number',
                    e.target.value
                  )}
                  className={`flex-1 px-3 py-2 border ${formErrors['contact.phone'] ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('branchModal.fields.phone.placeholder')}
                />
              </div>
              {formErrors['contact.phone'] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['contact.phone']}</p>
              )}
            </div>

            <div>
              <label htmlFor="mail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('branchModal.fields.email.label')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`} />
                <input
                  type="email"
                  id="mail"
                  name="contact.mail"
                  value={formData.createContactDto.mail || ''}
                  onChange={handleInputChange}
                  className={`w-full px-10 py-2 border ${formErrors['contact.mail'] ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder={t('branchModal.fields.email.placeholder')}
                />
              </div>
              {formErrors['contact.mail'] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors['contact.mail']}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('branchModal.fields.location.label')}
            </label>
            <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <MapPin className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none`} />
                <input
                  type="text"
                  id="location"
                  name="contact.location"
                  value={formData.createContactDto.location || ''}
                  onChange={handleInputChange}
                  readOnly
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
                  placeholder={t('branchModal.fields.location.placeholder')}
                />
              </div>
              <button
                type="button"
                onClick={handleOpenMapModal}
                className={`px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Navigation className="w-5 h-5" />
                <span className="hidden sm:inline">{t('onboardingBranch.form.step3.location.selectOnMap')}</span>
              </button>
            </div>
          </div>

          {/* --- MULTI-LANGUAGE FIELDS --- */}

          <MultiLanguageInput
            label={t('branchModal.fields.contactHeader.label')}
            value={contactHeaderTranslations}
            onChange={(val) => {
              setContactHeaderTranslations(val);
              const currentValue = val[language] || val[defaultLanguage] || '';
              setFormData(prev => ({
                ...prev,
                createContactDto: { ...prev.createContactDto, contactHeader: currentValue }
              }));
            }}
            languages={supportedLanguages}
            placeholder={t('branchModal.fields.contactHeader.placeholder')}
            defaultLanguage={defaultLanguage}
            selectedLanguage={selectedFormLanguage}
            showLanguageSelector={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiLanguageInput
              label={t('branchModal.fields.footerTitle.label')}
              value={footerTitleTranslations}
              onChange={(val) => {
                setFooterTitleTranslations(val);
                const currentValue = val[language] || val[defaultLanguage] || '';
                setFormData(prev => ({
                  ...prev,
                  createContactDto: { ...prev.createContactDto, footerTitle: currentValue }
                }));
              }}
              languages={supportedLanguages}
              placeholder={t('branchModal.fields.footerTitle.placeholder')}
              defaultLanguage={defaultLanguage}
              selectedLanguage={selectedFormLanguage}
              showLanguageSelector={false}
            />

            <MultiLanguageInput
              label={t('branchModal.fields.openTitle.label')}
              value={openTitleTranslations}
              onChange={(val) => {
                setOpenTitleTranslations(val);
                const currentValue = val[language] || val[defaultLanguage] || '';
                setFormData(prev => ({
                  ...prev,
                  createContactDto: { ...prev.createContactDto, openTitle: currentValue }
                }));
              }}
              languages={supportedLanguages}
              placeholder={t('branchModal.fields.openTitle.placeholder')}
              defaultLanguage={defaultLanguage}
              selectedLanguage={selectedFormLanguage}
              showLanguageSelector={false}
            />
          </div>

          <MultiLanguageTextArea
            label={t('branchModal.fields.footerDescription.label')}
            value={footerDescriptionTranslations}
            onChange={(val) => {
              setFooterDescriptionTranslations(val);
              const currentValue = val[language] || val[defaultLanguage] || '';
              setFormData(prev => ({
                ...prev,
                createContactDto: { ...prev.createContactDto, footerDescription: currentValue }
              }));
            }}
            languages={supportedLanguages}
            placeholder={t('branchModal.fields.footerDescription.placeholder')}
            rows={3}
            defaultLanguage={defaultLanguage}
            selectedLanguage={selectedFormLanguage}
            showLanguageSelector={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MultiLanguageInput
              label={t('branchModal.fields.openDays.label')}
              value={openDaysTranslations}
              onChange={(val) => {
                setOpenDaysTranslations(val);
                const currentValue = val[language] || val[defaultLanguage] || '';
                setFormData(prev => ({
                  ...prev,
                  createContactDto: { ...prev.createContactDto, openDays: currentValue }
                }));
              }}
              languages={supportedLanguages}
              placeholder={t('branchModal.fields.openDays.placeholder')}
              defaultLanguage={defaultLanguage}
              selectedLanguage={selectedFormLanguage}
              showLanguageSelector={false}
            />

            <MultiLanguageInput
              label={t('branchModal.fields.openHours.label')}
              value={openHoursTranslations}
              onChange={(val) => {
                setOpenHoursTranslations(val);
                const currentValue = val[language] || val[defaultLanguage] || '';
                setFormData(prev => ({
                  ...prev,
                  createContactDto: { ...prev.createContactDto, openHours: currentValue }
                }));
              }}
              languages={supportedLanguages}
              placeholder={t('branchModal.fields.openHours.placeholder')}
              defaultLanguage={defaultLanguage}
              selectedLanguage={selectedFormLanguage}
              showLanguageSelector={false}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
          <Clock className="h-6 w-6 text-primary-600" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('branchModal.sections.workingHours')}
          </h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('branchModal.workingHours.description')}
        </p>

        <div className="space-y-3">
          {formData.createBranchWorkingHourCoreDto?.map((day, index) => (
            <div
              key={day.dayOfWeek}
              className={`relative group p-5 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 hover:shadow-md ${
                day.isWorkingDay
                  ? day.isOpen24Hours
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700'
                    : 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700'
                  : 'bg-gray-50 dark:bg-gray-800/50'
              }`}
            >
              <div className="flex flex-col space-y-4">
                {/* Header Row: Day Name, 24 Hours Toggle, and Working Day Toggle */}
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="min-w-[100px]">
                    <span className={`text-base font-medium text-gray-900 dark:text-gray-100 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {dayNamesDisplay[index]}
                    </span>
                  </div>

                  <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* 24 Hours Toggle - Only show when working day is enabled */}
                    {day.isWorkingDay && (
                      <div className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Toggle
                          checked={day.isOpen24Hours}
                          onChange={(checked) => handleWorkingHourChange(index, 'isOpen24Hours', checked)}
                        />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {t('branchModal.workingHours.open24Hours') || '24H'}
                        </span>
                      </div>
                    )}

                    {/* Working Day Toggle */}
                    <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Toggle
                        checked={day.isWorkingDay}
                        onChange={(checked) => handleWorkingHourChange(index, 'isWorkingDay', checked)}
                      />
                      <span className={`text-sm font-medium transition-colors hidden xs:block ${
                        day.isWorkingDay
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {day.isWorkingDay ? t('branchModal.workingHours.open') : t('branchModal.workingHours.closed')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 24 Hours Message */}
                {day.isWorkingDay && day.isOpen24Hours && (
                  <div className="text-center py-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                      <Clock className="w-4 h-4 mr-2" />
                      {t('branchModal.workingHours.open24HoursMessage') || 'Open 24 hours'}
                    </span>
                  </div>
                )}

                {/* Time Slots - Show when working day is enabled and not 24 hours */}
                {day.isWorkingDay && !day.isOpen24Hours && (
                  <div className="space-y-3">
                    {day.timeSlots?.map((slot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className={`
                          grid grid-cols-2 gap-4
                          sm:flex sm:items-center sm:justify-center sm:gap-3
                          ${isRTL ? 'sm:flex-row-reverse' : ''}
                        `}
                      >
                        {/* Open Time Group */}
                        <div className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                          <label className={`text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('branchModal.workingHours.openTime')}
                          </label>
                          <input
                            title='time'
                            type="time"
                            value={formatTimeForInput(slot.openTime)}
                            onChange={(e) => handleTimeSlotChange(index, slotIndex, 'openTime', e.target.value)}
                            className={`w-full sm:w-auto px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300 ${isRTL ? 'text-right' : 'text-left'}`}
                            dir="ltr"
                          />
                        </div>

                        {/* Separator */}
                        <div className="hidden sm:flex items-center justify-center">
                          <div className="w-4 h-px bg-gray-300 dark:bg-gray-600"></div>
                        </div>

                        {/* Close Time Group */}
                        <div className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                          <label className={`text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('branchModal.workingHours.closeTime')}
                          </label>
                          <input
                            title='time'
                            type="time"
                            value={formatTimeForInput(slot.closeTime)}
                            onChange={(e) => handleTimeSlotChange(index, slotIndex, 'closeTime', e.target.value)}
                            className={`w-full sm:w-auto px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium transition-all focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-300 ${isRTL ? 'text-right' : 'text-left'}`}
                            dir="ltr"
                          />
                        </div>

                        {/* Remove Slot Button - Show only if more than 1 slot */}
                        {(day.timeSlots?.length || 0) > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTimeSlot(index, slotIndex)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title={t('common.remove') || 'Remove'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add Time Slot Button */}
                    <button
                      type="button"
                      onClick={() => handleAddTimeSlot(index)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      {t('branchModal.workingHours.addTimeSlot') || 'Add Time Slot'}
                    </button>
                  </div>
                )}
              </div>

              {day.isWorkingDay && !day.isOpen24Hours && (
                <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700/50">
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {t('branchModal.workingHours.canOrder')}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
          <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {t('branchModal.workingHours.infoTitle')}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {t('branchModal.workingHours.infoText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-6xl h-[95vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('branchModal.title.add')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('branchModal.subtitle')}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {[
                { id: 1, name: t('branchModal.steps.basic'), icon: Building2 },
                { id: 2, name: t('branchModal.steps.address'), icon: MapPin },
                { id: 3, name: t('branchModal.steps.contact'), icon: Clock }
              ].map((step, stepIdx) => {
                const StepIcon = step.icon;
                const isClickable = currentStep >= step.id;
                return (
                  <li
                    key={step.name}
                    className={`relative ${stepIdx !== 2 ? (isRTL ? 'pl-8 sm:pl-20' : 'pr-8 sm:pr-20') : ''}`}
                  >
                    <div className="flex items-center">
                      <button
                        type="button"
                        disabled={!isClickable}
                        onClick={() => isClickable && setCurrentStep(step.id)}
                        className={`focus:outline-none transition-shadow duration-200 rounded-full ${isClickable ? 'hover:shadow-lg' : ''}`}
                        aria-label={step.name}
                      >
                        <div
                          className={`${
                            currentStep >= step.id
                              ? 'bg-primary-600 border-primary-600'
                              : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                          } rounded-full transition-colors duration-200 h-10 w-10 flex items-center justify-center border-2`}
                        >
                          <StepIcon
                            className={`w-5 h-5 ${
                              currentStep >= step.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}
                          />
                        </div>
                      </button>
                      <div
                        className={`hidden sm:block text-sm font-medium ${
                          currentStep >= step.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                        } ${isRTL ? 'mr-3' : 'ml-3'}`}
                      >
                        {step.name}
                      </div>
                      {stepIdx !== 2 && (
                        <div
                          className={`hidden sm:block absolute top-5 ${isRTL ? 'left-0' : 'right-0'} w-20 h-0.5 transition-colors duration-200 ${
                            currentStep > step.id ? 'bg-primary-600 dark:bg-primary-400' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Centralized Language Control - Always Visible */}
        <div className="px-6 pt-4">
          <LanguageFormControl
            languages={supportedLanguages}
            selectedLanguage={selectedFormLanguage}
            onLanguageChange={setSelectedFormLanguage}
            defaultLanguage={defaultLanguage}
            required={true}
            showBulkFill={true}
            onBulkFill={handleBulkFillLanguage}
            fieldValues={{
              branchName: branchNameTranslations,
              contactHeader: contactHeaderTranslations,
              footerTitle: footerTitleTranslations,
              footerDescription: footerDescriptionTranslations,
              openTitle: openTitleTranslations,
              openDays: openDaysTranslations,
              openHours: openHoursTranslations,
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            type="button"
            onClick={currentStep === 1 ? onClose : handlePreviousStep}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            {currentStep === 1 ? <X className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> : (isRTL ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />)}
            {currentStep === 1 ? t('branchModal.buttons.cancel') : t('branchModal.buttons.back')}
          </button>
          <button
            type="button"
            onClick={currentStep === 3 ? handleSubmit : handleNextStep}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !isCurrentStepValid}
          >
            {currentStep === 3 ? (isSubmitting ? t('branchModal.buttons.saving') : t('branchModal.buttons.save')) : t('branchModal.buttons.next')}
            {currentStep === 3 ? <></> : (isRTL ? <ArrowLeft className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />)}
          </button>
        </div>
      </div>
      {/* Render the Map Modal here */}
      <MapPickerModal />
    </div>
  );
};

export default BranchModal;