import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Building2, MapPin, Phone, Clock, Upload, Trash2,
  Image as ImageIcon, AlertTriangle, Globe, Navigation,
  ChevronDown, Search, Check, Info
} from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import {
  BranchDetailResponse,
  BranchEditFormData,
  CreateBranchWorkingHourCoreDto,
  CreateBranchWithDetailsDto
} from '../../../../types/api';
import { mediaService } from '../../../../services/mediaService';
import { logger } from '../../../../utils/logger';
import { countriesWithCodes, countryKeys } from '../../../../data/mockData';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MultiLanguageInput } from '../../../common/MultiLanguageInput';
import { MultiLanguageTextArea } from '../../../common/MultiLanguageTextArea';
import { LanguageFormControl } from '../../../common/LanguageFormControl';
import { useTranslatableFields, TranslatableFieldValue, translationResponseToObject } from '../../../../hooks/useTranslatableFields';
import { branchTranslationService } from '../../../../services/Translations/BranchTranslationService';
import { contactTranslationService } from '../../../../services/Translations/ContactTranslationService';
import { languageService } from '../../../../services/LanguageService';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { CustomSelect } from '../../../common/CustomSelect';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});


// --- End Custom Select Component ---


interface BranchEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBranchWithDetailsDto) => Promise<void>;
  branchDetail: BranchDetailResponse;
  isSubmitting: boolean;
  onSuccess?: () => Promise<void>; // Callback to refresh branch list after successful save
}

const BranchEditModal: React.FC<BranchEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  branchDetail,
  isSubmitting,
  onSuccess,
}) => {
  const { t, isRTL, language: currentLanguage } = useLanguage();
  const translationHook = useTranslatableFields();

  // Supported languages - dynamically loaded
  const [supportedLanguages, setSupportedLanguages] = useState<any[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState<string>('en');

  const [formData, setFormData] = useState<BranchEditFormData>({
    branchName: '',
    restaurantId: branchDetail.restaurantId,
    whatsappOrderNumber: null,
    branchLogoPath: null,
    createAddressDto: {
      country: null,
      city: null,
      street: null,
      zipCode: null,
      addressLine1: null,
      addressLine2: null,
    },
    createContactDto: {
      phone: null,
      mail: null,
      location: null,
      contactHeader: null,
      footerTitle: null,
      footerDescription: null,
      openTitle: null,
      openDays: null,
      openHours: null,
    },
    createBranchWorkingHourCoreDto: []
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'address' | 'contact' | 'workingHours'>('general');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedFormLanguage, setSelectedFormLanguage] = useState<string>(defaultLanguage);

  // Image upload states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Map modal state
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number; lng: number }>({
    lat: 41.0082, // Default to Istanbul
    lng: 28.9784
  });
  const [googleMapsLink, setGoogleMapsLink] = useState<string>('');
  const [linkError, setLinkError] = useState<string>('');

  // Translation state for branch fields
  const [branchNameTranslations, setBranchNameTranslations] = useState<TranslatableFieldValue>({});
  const [branchAddressTranslations, setBranchAddressTranslations] = useState<TranslatableFieldValue>({});

  // Translation state for contact fields
  const [contactHeaderTranslations, setContactHeaderTranslations] = useState<TranslatableFieldValue>({});
  const [footerTitleTranslations, setFooterTitleTranslations] = useState<TranslatableFieldValue>({});
  const [footerDescriptionTranslations, setFooterDescriptionTranslations] = useState<TranslatableFieldValue>({});
  const [openTitleTranslations, setOpenTitleTranslations] = useState<TranslatableFieldValue>({});
  const [openDaysTranslations, setOpenDaysTranslations] = useState<TranslatableFieldValue>({});
  const [openHoursTranslations, setOpenHoursTranslations] = useState<TranslatableFieldValue>({});

  const defaultWorkingHours: CreateBranchWorkingHourCoreDto[] = [
    { dayOfWeek: 1, isWorkingDay: true, isOpen24Hours: false, timeSlots: [{ openTime: '08:00:00', closeTime: '22:00:00' }] },
    { dayOfWeek: 2, isWorkingDay: true, isOpen24Hours: false, timeSlots: [{ openTime: '08:00:00', closeTime: '22:00:00' }] },
    { dayOfWeek: 3, isWorkingDay: true, isOpen24Hours: false, timeSlots: [{ openTime: '08:00:00', closeTime: '22:00:00' }] },
    { dayOfWeek: 4, isWorkingDay: true, isOpen24Hours: false, timeSlots: [{ openTime: '08:00:00', closeTime: '22:00:00' }] },
    { dayOfWeek: 5, isWorkingDay: true, isOpen24Hours: false, timeSlots: [{ openTime: '08:00:00', closeTime: '22:00:00' }] },
    { dayOfWeek: 6, isWorkingDay: true, isOpen24Hours: false, timeSlots: [{ openTime: '08:00:00', closeTime: '22:00:00' }] },
    { dayOfWeek: 0, isWorkingDay: false, isOpen24Hours: false, timeSlots: [] }
  ];

  const getDayName = (dayOfWeek: number): string => {
    return t(`branchManagement.form.dayNames.${dayOfWeek}`);
  };

  // Helper to parse full phone number into code and local number
  const getPhoneParts = (fullNumber: string | null) => {
    if (!fullNumber) return { code: '+90', number: '' }; // Default to TR if empty
    
    // Sort countries by code length desc to match longest prefix first
    const sortedCountries = [...countriesWithCodes].sort((a, b) => b.code.length - a.code.length);
    const country = sortedCountries.find(c => fullNumber.startsWith(c.code));
    
    if (country) {
      return {
        code: country.code,
        number: fullNumber.slice(country.code.length)
      };
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

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const languagesData = await languageService.getRestaurantLanguages();

        // Deduplicate languages by code
        const uniqueLanguages = (languagesData.availableLanguages || []).reduce((acc: any[], lang: any) => {
          if (!acc.find((l: any) => l.code === lang.code)) {
            acc.push(lang);
          }
          return acc;
        }, []);

        setSupportedLanguages(uniqueLanguages);
        setDefaultLanguage(languagesData.defaultLanguage || 'en');
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };
    loadLanguages();
  }, []);

  useEffect(() => {
    if (branchDetail && isOpen) {
      logger.info('Initializing form data from branch detail', branchDetail, { prefix: 'BranchEditModal' });

      const initialFormData = {
        branchName: branchDetail.branchName || '',
        restaurantId: branchDetail.restaurantId,
        whatsappOrderNumber: branchDetail.whatsappOrderNumber || null,
        branchLogoPath: branchDetail.branchLogoPath || null,
        createAddressDto: {
          country: branchDetail.address?.country || null,
          city: branchDetail.address?.city || null,
          street: branchDetail.address?.street || null,
          zipCode: branchDetail.address?.zipCode || null,
          addressLine1: branchDetail.address?.addressLine1 || null,
          addressLine2: branchDetail.address?.addressLine2 || null,
        },
        createContactDto: {
          phone: branchDetail.contact?.phone || null,
          mail: branchDetail.contact?.mail || null,
          location: branchDetail.contact?.location || null,
          contactHeader: branchDetail.contact?.contactHeader || null,
          footerTitle: branchDetail.contact?.footerTitle || null,
          footerDescription: branchDetail.contact?.footerDescription || null,
          openTitle: branchDetail.contact?.openTitle || null,
          openDays: branchDetail.contact?.openDays || null,
          openHours: branchDetail.contact?.openHours || null,
        },
        createBranchWorkingHourCoreDto: branchDetail.workingHours?.length
          ? branchDetail.workingHours.map(wh => {
              // Handle backward compatibility with old API format that had openTime/closeTime at root level
              const legacyWh = wh as any;
              return {
                dayOfWeek: wh.dayOfWeek,
                isWorkingDay: wh.isWorkingDay ?? true,
                isOpen24Hours: wh.isOpen24Hours ?? false,
                timeSlots: wh.timeSlots && wh.timeSlots.length > 0
                  ? wh.timeSlots.map(slot => ({
                      id: slot.id,
                      openTime: slot.openTime || '08:00:00',
                      closeTime: slot.closeTime || '22:00:00',
                    }))
                  : wh.isWorkingDay && !wh.isOpen24Hours
                    ? [{ openTime: legacyWh.openTime || '08:00:00', closeTime: legacyWh.closeTime || '22:00:00' }]
                    : [],
              };
            })
          : defaultWorkingHours,
      };

      setFormData(initialFormData);
      setImagePreview(branchDetail.branchLogoPath);
      setHasChanges(false);
      setActiveTab('general');
      setValidationErrors({});
      setUploadError(null);

      // Load branch translations
      const loadBranchTranslations = async () => {
        try {
          const branchTranslations: any = await branchTranslationService.getBranchTranslations(branchDetail.id);

          let nameTranslations: TranslatableFieldValue = {};
          let addressTranslations: TranslatableFieldValue = {};

          // Check if response is in new format (with baseValues and translations)
          if (branchTranslations.baseValues && branchTranslations.translations) {
            nameTranslations = translationResponseToObject(branchTranslations, 'branchName');
            addressTranslations = translationResponseToObject(branchTranslations, 'address');
          } else {
            // Fallback: initialize with base values
            const languageCodes = supportedLanguages.map((lang: any) => lang.code);
            nameTranslations = translationHook.getEmptyTranslations(languageCodes);
            addressTranslations = translationHook.getEmptyTranslations(languageCodes);

            nameTranslations[defaultLanguage] = branchDetail.branchName || '';
            addressTranslations[defaultLanguage] = `${branchDetail.address?.street || ''}, ${branchDetail.address?.city || ''}`;
          }

          setBranchNameTranslations(nameTranslations);
          setBranchAddressTranslations(addressTranslations);
        } catch (error) {
          console.error('Failed to load branch translations:', error);
          const languageCodes = supportedLanguages.map((lang: any) => lang.code);
          const emptyNameTranslations = translationHook.getEmptyTranslations(languageCodes);
          const emptyAddressTranslations = translationHook.getEmptyTranslations(languageCodes);

          emptyNameTranslations[defaultLanguage] = branchDetail.branchName || '';
          emptyAddressTranslations[defaultLanguage] = `${branchDetail.address?.street || ''}, ${branchDetail.address?.city || ''}`;

          setBranchNameTranslations(emptyNameTranslations);
          setBranchAddressTranslations(emptyAddressTranslations);
        }
      };

      // Load contact translations
      const loadContactTranslations = async () => {
        if (!branchDetail.contact?.contactId) {
          const languageCodes = supportedLanguages.map((lang: any) => lang.code);
          setContactHeaderTranslations(translationHook.getEmptyTranslations(languageCodes));
          setFooterTitleTranslations(translationHook.getEmptyTranslations(languageCodes));
          setFooterDescriptionTranslations(translationHook.getEmptyTranslations(languageCodes));
          setOpenTitleTranslations(translationHook.getEmptyTranslations(languageCodes));
          setOpenDaysTranslations(translationHook.getEmptyTranslations(languageCodes));
          setOpenHoursTranslations(translationHook.getEmptyTranslations(languageCodes));
          return;
        }

        try {
          const contactTranslations: any = await contactTranslationService.getContactTranslations(
            branchDetail.contact.contactId,
            branchDetail.id
          );

          let headerTranslations: TranslatableFieldValue = {};
          let footerTitleTrans: TranslatableFieldValue = {};
          let footerDescTrans: TranslatableFieldValue = {};
          let openTitleTrans: TranslatableFieldValue = {};
          let openDaysTrans: TranslatableFieldValue = {};
          let openHoursTrans: TranslatableFieldValue = {};

          // Check if response is in new format (with baseValues and translations)
          if (contactTranslations.baseValues && contactTranslations.translations) {
            headerTranslations = translationResponseToObject(contactTranslations, 'contactHeader');
            footerTitleTrans = translationResponseToObject(contactTranslations, 'footerTitle');
            footerDescTrans = translationResponseToObject(contactTranslations, 'footerDescription');
            openTitleTrans = translationResponseToObject(contactTranslations, 'openTitle');
            openDaysTrans = translationResponseToObject(contactTranslations, 'openDays');
            openHoursTrans = translationResponseToObject(contactTranslations, 'openHours');
          } else {
            // Fallback: initialize with base values
            const languageCodes = supportedLanguages.map((lang: any) => lang.code);
            headerTranslations = translationHook.getEmptyTranslations(languageCodes);
            footerTitleTrans = translationHook.getEmptyTranslations(languageCodes);
            footerDescTrans = translationHook.getEmptyTranslations(languageCodes);
            openTitleTrans = translationHook.getEmptyTranslations(languageCodes);
            openDaysTrans = translationHook.getEmptyTranslations(languageCodes);
            openHoursTrans = translationHook.getEmptyTranslations(languageCodes);

            headerTranslations[defaultLanguage] = branchDetail.contact?.contactHeader || '';
            footerTitleTrans[defaultLanguage] = branchDetail.contact?.footerTitle || '';
            footerDescTrans[defaultLanguage] = branchDetail.contact?.footerDescription || '';
            openTitleTrans[defaultLanguage] = branchDetail.contact?.openTitle || '';
            openDaysTrans[defaultLanguage] = branchDetail.contact?.openDays || '';
            openHoursTrans[defaultLanguage] = branchDetail.contact?.openHours || '';
          }

          setContactHeaderTranslations(headerTranslations);
          setFooterTitleTranslations(footerTitleTrans);
          setFooterDescriptionTranslations(footerDescTrans);
          setOpenTitleTranslations(openTitleTrans);
          setOpenDaysTranslations(openDaysTrans);
          setOpenHoursTranslations(openHoursTrans);
        } catch (error) {
          console.error('Failed to load contact translations:', error);
          const languageCodes = supportedLanguages.map((lang: any) => lang.code);
          const emptyHeaderTrans = translationHook.getEmptyTranslations(languageCodes);
          const emptyFooterTitleTrans = translationHook.getEmptyTranslations(languageCodes);
          const emptyFooterDescTrans = translationHook.getEmptyTranslations(languageCodes);
          const emptyOpenTitleTrans = translationHook.getEmptyTranslations(languageCodes);
          const emptyOpenDaysTrans = translationHook.getEmptyTranslations(languageCodes);
          const emptyOpenHoursTrans = translationHook.getEmptyTranslations(languageCodes);

          emptyHeaderTrans[defaultLanguage] = branchDetail.contact?.contactHeader || '';
          emptyFooterTitleTrans[defaultLanguage] = branchDetail.contact?.footerTitle || '';
          emptyFooterDescTrans[defaultLanguage] = branchDetail.contact?.footerDescription || '';
          emptyOpenTitleTrans[defaultLanguage] = branchDetail.contact?.openTitle || '';
          emptyOpenDaysTrans[defaultLanguage] = branchDetail.contact?.openDays || '';
          emptyOpenHoursTrans[defaultLanguage] = branchDetail.contact?.openHours || '';

          setContactHeaderTranslations(emptyHeaderTrans);
          setFooterTitleTranslations(emptyFooterTitleTrans);
          setFooterDescriptionTranslations(emptyFooterDescTrans);
          setOpenTitleTranslations(emptyOpenTitleTrans);
          setOpenDaysTranslations(emptyOpenDaysTrans);
          setOpenHoursTranslations(emptyOpenHoursTrans);
        }
      };

      loadBranchTranslations();
      loadContactTranslations();
    }
  }, [branchDetail, isOpen]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.branchName?.trim()) {
      errors.branchName = t('branchManagement.form.branchNameRequired');
    }

    const hasWorkingDay = formData.createBranchWorkingHourCoreDto?.some(day => day.isWorkingDay);
    if (!hasWorkingDay) {
      errors.workingHours = t('branchManagement.form.workingHoursRequired');
    }

    // Validate that each working day has either isOpen24Hours or at least one valid time slot
    const workingDaysWithoutHours = formData.createBranchWorkingHourCoreDto?.filter(day => {
      if (!day.isWorkingDay) return false;
      if (day.isOpen24Hours) return false;
      // Check if there's at least one valid time slot
      const hasValidSlot = day.timeSlots?.some(slot => slot.openTime && slot.closeTime);
      return !hasValidSlot;
    });

    if (workingDaysWithoutHours && workingDaysWithoutHours.length > 0) {
      errors.workingHours = t('branchManagement.form.workingHoursSlotRequired') || 'Each working day must have either 24 hours or at least one time slot';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  const updateFormData = (name: string, value: any) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof BranchEditFormData] as any),
          [child]: value || null
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value || null
      }));
    }
    setHasChanges(true);

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handler for Country Code + Phone Number updates
  // Bulk fill all fields from default language to selected language
  const handleBulkFillLanguage = (targetLanguage: string) => {
    if (targetLanguage === defaultLanguage || !targetLanguage) return;

    // Copy all default language values to target language
    if (branchNameTranslations[defaultLanguage]) {
      setBranchNameTranslations(prev => ({ ...prev, [targetLanguage]: prev[defaultLanguage] }));
    }
    if (branchAddressTranslations[defaultLanguage]) {
      setBranchAddressTranslations(prev => ({ ...prev, [targetLanguage]: prev[defaultLanguage] }));
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

  const handlePhoneCompositeChange = (
    fullFieldName: string,
    currentFullValue: string | null,
    partType: 'code' | 'number',
    newValue: string
  ) => {
    const { code, number } = getPhoneParts(currentFullValue);
    
    let newFullNumber = '';
    
    if (partType === 'code') {
      newFullNumber = newValue + number;
    } else {
      newFullNumber = code + newValue;
    }

    updateFormData(fullFieldName, newFullNumber);
  };

  const handleWorkingHourChange = (dayIndex: number, field: keyof CreateBranchWorkingHourCoreDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      createBranchWorkingHourCoreDto: prev.createBranchWorkingHourCoreDto.map((hours, idx) => {
        if (idx !== dayIndex) return hours;

        // Handle special cases for backend validation rules
        if (field === 'isWorkingDay') {
          if (!value) {
            // Non-working days cannot have time slots
            return { ...hours, isWorkingDay: value, timeSlots: [], isOpen24Hours: false };
          } else {
            // When enabling working day, add default time slot if none exists
            return {
              ...hours,
              isWorkingDay: value,
              timeSlots: hours.timeSlots?.length ? hours.timeSlots : [{ openTime: '08:00:00', closeTime: '22:00:00' }]
            };
          }
        }

        if (field === 'isOpen24Hours') {
          if (value) {
            // 24-hour open days cannot have time slots
            return { ...hours, isOpen24Hours: value, timeSlots: [] };
          } else {
            // When disabling 24 hours, add default time slot
            return { ...hours, isOpen24Hours: value, timeSlots: [{ openTime: '08:00:00', closeTime: '22:00:00' }] };
          }
        }

        return { ...hours, [field]: value };
      })
    }));
    setHasChanges(true);

    if (validationErrors.workingHours) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.workingHours;
        return newErrors;
      });
    }
  };

  const handleTimeSlotChange = (dayIndex: number, slotIndex: number, field: 'openTime' | 'closeTime', value: string) => {
    setFormData(prev => ({
      ...prev,
      createBranchWorkingHourCoreDto: prev.createBranchWorkingHourCoreDto.map((hours, idx) => {
        if (idx !== dayIndex) return hours;
        const newTimeSlots = [...(hours.timeSlots || [])];
        if (newTimeSlots[slotIndex]) {
          newTimeSlots[slotIndex] = { ...newTimeSlots[slotIndex], [field]: value };
        }
        return { ...hours, timeSlots: newTimeSlots };
      })
    }));
    setHasChanges(true);
  };

  const handleAddTimeSlot = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      createBranchWorkingHourCoreDto: prev.createBranchWorkingHourCoreDto.map((hours, idx) => {
        if (idx !== dayIndex) return hours;
        const newTimeSlots = [...(hours.timeSlots || []), { openTime: '08:00:00', closeTime: '22:00:00' }];
        return { ...hours, timeSlots: newTimeSlots };
      })
    }));
    setHasChanges(true);
  };

  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
    setFormData(prev => ({
      ...prev,
      createBranchWorkingHourCoreDto: prev.createBranchWorkingHourCoreDto.map((hours, idx) => {
        if (idx !== dayIndex) return hours;
        const newTimeSlots = (hours.timeSlots || []).filter((_, i) => i !== slotIndex);
        return { ...hours, timeSlots: newTimeSlots };
      })
    }));
    setHasChanges(true);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(t('branchManagement.modal.errors.invalidFileType'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError(t('branchManagement.modal.errors.fileSizeError'));
      return;
    }

    setUploadError(null);
    setIsUploadingImage(true);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      const previousUrl = formData.branchLogoPath;
      const newImageUrl = await mediaService.uploadFile(file, previousUrl || undefined);
      
      setFormData(prev => ({
        ...prev,
        branchLogoPath: newImageUrl
      }));
      
      setHasChanges(true);
      logger.info('Image uploaded successfully', { newImageUrl }, { prefix: 'BranchEditModal' });
      
    } catch (error) {
      logger.error('Image upload failed', error, { prefix: 'BranchEditModal' });
      setUploadError(t('branchManagement.modal.errors.imageUploadError'));
      setImagePreview(formData.branchLogoPath);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (!formData.branchLogoPath) return;

    try {
      await mediaService.deleteFile(formData.branchLogoPath);
      setFormData(prev => ({
        ...prev,
        branchLogoPath: null
      }));
      setImagePreview(null);
      setHasChanges(true);
      logger.info('Image removed successfully', null, { prefix: 'BranchEditModal' });
    } catch (error) {
      logger.error('Image removal failed', error, { prefix: 'BranchEditModal' });
      setUploadError(t('branchManagement.modal.errors.imageRemoveError'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      if (validationErrors.branchName) setActiveTab('general');
      if (validationErrors.workingHours) setActiveTab('workingHours');
      return;
    }

    setUploadError(null);

    try {
      const submitData: CreateBranchWithDetailsDto = {
        branchName: formData.branchName?.trim() || null,
        whatsappOrderNumber: formData.whatsappOrderNumber?.trim() || null,
        restaurantId: formData.restaurantId,
        branchLogoPath: formData.branchLogoPath || null,
        createAddressDto: {
          country: formData.createAddressDto.country?.trim() || null,
          city: formData.createAddressDto.city?.trim() || null,
          street: formData.createAddressDto.street?.trim() || null,
          zipCode: formData.createAddressDto.zipCode?.trim() || null,
          addressLine1: formData.createAddressDto.addressLine1?.trim() || null,
          addressLine2: formData.createAddressDto.addressLine2?.trim() || null,
        },
        createContactDto: {
          phone: formData.createContactDto.phone?.trim() || null,
          mail: formData.createContactDto.mail?.trim() || null,
          location: formData.createContactDto.location?.trim() || null,
          contactHeader: formData.createContactDto.contactHeader?.trim() || null,
          footerTitle: formData.createContactDto.footerTitle?.trim() || null,
          footerDescription: formData.createContactDto.footerDescription?.trim() || null,
          openTitle: formData.createContactDto.openTitle?.trim() || null,
          openDays: formData.createContactDto.openDays?.trim() || null,
          openHours: formData.createContactDto.openHours?.trim() || null,
        },
        createBranchWorkingHourCoreDto: formData.createBranchWorkingHourCoreDto?.map(hour => ({
          dayOfWeek: hour.dayOfWeek,
          isWorkingDay: hour.isWorkingDay,
          isOpen24Hours: hour.isOpen24Hours,
          timeSlots: hour.timeSlots?.map(slot => ({
            id: slot.id,
            openTime: slot.openTime,
            closeTime: slot.closeTime,
          })) || []
        })) || []
      };

      logger.info('Submitting branch update data', submitData, { prefix: 'BranchEditModal' });
      await onSubmit(submitData);
      logger.info('Branch update successful', null, { prefix: 'BranchEditModal' });

      // Save branch translations
      try {
        logger.info('Starting branch translation save', {
          branchNameTranslations,
          branchAddressTranslations,
          defaultLanguage,
          branchId: branchDetail.id || branchDetail.branchId
        }, { prefix: 'BranchEditModal' });

        const branchTranslationData = Object.keys(branchNameTranslations)
          .filter(lang => {
            const isNotDefault = lang !== defaultLanguage;
            const hasValue = branchNameTranslations[lang];
            logger.info(`Checking language ${lang}`, { isNotDefault, hasValue, value: branchNameTranslations[lang] }, { prefix: 'BranchEditModal' });
            return isNotDefault && hasValue;
          })
          .map(languageCode => ({
            branchId: branchDetail.id || branchDetail.branchId,
            languageCode,
            branchName: branchNameTranslations[languageCode] || undefined,
            description: undefined,
            address: branchAddressTranslations[languageCode] || undefined
          }));

        logger.info('Branch translation data prepared', { count: branchTranslationData.length, data: branchTranslationData }, { prefix: 'BranchEditModal' });

        if (branchTranslationData.length > 0) {
          logger.info('Calling batchUpsertBranchTranslations', { translations: branchTranslationData }, { prefix: 'BranchEditModal' });
          await branchTranslationService.batchUpsertBranchTranslations({
            translations: branchTranslationData
          });
          logger.info('Branch translations saved successfully', null, { prefix: 'BranchEditModal' });
        } else {
          logger.warn('No branch translations to save', null, { prefix: 'BranchEditModal' });
        }
      } catch (translationError) {
        logger.error('Failed to save branch translations', translationError, { prefix: 'BranchEditModal' });
        console.error('Branch translation save error:', translationError);
        // Don't fail the whole operation if translations fail
      }

      // Save contact translations
      if (branchDetail.contact?.contactId) {
        try {
          logger.info('Starting contact translation save', {
            contactId: branchDetail.contact.contactId,
            contactHeaderTranslations,
            defaultLanguage
          }, { prefix: 'BranchEditModal' });

          const contactTranslationData = Object.keys(contactHeaderTranslations)
            .filter(lang => lang !== defaultLanguage)
            .filter(lang =>
              contactHeaderTranslations[lang] ||
              footerTitleTranslations[lang] ||
              footerDescriptionTranslations[lang] ||
              openTitleTranslations[lang] ||
              openDaysTranslations[lang] ||
              openHoursTranslations[lang]
            )
            .map(languageCode => ({
              contactId: branchDetail.contact!.contactId,
              languageCode,
              contactHeader: contactHeaderTranslations[languageCode] || undefined,
              footerTitle: footerTitleTranslations[languageCode] || undefined,
              footerDescription: footerDescriptionTranslations[languageCode] || undefined,
              openTitle: openTitleTranslations[languageCode] || undefined,
              openDays: openDaysTranslations[languageCode] || undefined,
              openHours: openHoursTranslations[languageCode] || undefined
            }));

          logger.info('Contact translation data prepared', { count: contactTranslationData.length, data: contactTranslationData }, { prefix: 'BranchEditModal' });

          if (contactTranslationData.length > 0) {
            logger.info('Calling batchUpsertContactTranslations', null, { prefix: 'BranchEditModal' });
            await contactTranslationService.batchUpsertContactTranslations(
              { translations: contactTranslationData },
              branchDetail.id || branchDetail.branchId
            );
            logger.info('Contact translations saved successfully', null, { prefix: 'BranchEditModal' });
          } else {
            logger.warn('No contact translations to save', null, { prefix: 'BranchEditModal' });
          }
        } catch (translationError) {
          logger.error('Failed to save contact translations', translationError, { prefix: 'BranchEditModal' });
          console.error('Contact translation save error:', translationError);
          // Don't fail the whole operation if translations fail
        }
      } else {
        logger.warn('No contact found for branch, skipping contact translations', { branchDetail }, { prefix: 'BranchEditModal' });
      }

      // Refresh branch list and close modal after successful save
      if (onSuccess) {
        await onSuccess();
      }
      onClose();

    } catch (error: any) {
      logger.error('Branch update failed', error, { prefix: 'BranchEditModal' });
      
      if (error?.response?.status === 400) {
        const errorData = error?.response?.data;
        if (errorData?.errors) {
          const apiErrors: Record<string, string> = {};
          
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              const formField = field.toLowerCase();
              if (formField.includes('branchname')) {
                apiErrors.branchName = messages[0];
              } else if (formField.includes('address')) {
                apiErrors.address = messages[0];
                setActiveTab('address');
              } else if (formField.includes('contact')) {
                apiErrors.contact = messages[0];
                setActiveTab('contact');
              } else if (formField.includes('workinghour')) {
                apiErrors.workingHours = messages[0];
                setActiveTab('workingHours');
              } else {
                apiErrors[field] = messages[0];
              }
            }
          });
          
          setValidationErrors(apiErrors);
          setUploadError(t('branchManagement.modal.errors.validationFailed'));
        } else {
          setUploadError(t('branchManagement.modal.errors.dataValidationError'));
        }
      } else if (error?.response?.status === 401) {
        setUploadError(t('branchManagement.error.sessionExpired'));
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error?.response?.status === 403) {
        setUploadError(t('branchManagement.error.noPermission'));
      } else if (error?.response?.status === 404) {
        setUploadError(t('branchManagement.error.branchNotFound'));
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (error?.response?.status === 0 || !navigator.onLine) {
        setUploadError(t('branchManagement.error.connectionError'));
      } else {
        setUploadError(
          error?.message || 
          t('branchManagement.error.unknownError')
        );
      }
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

  // Map handlers
  const handleOpenMapModal = (): void => {
    // Try to parse existing location
    if (formData.createContactDto.location) {
      try {
        const [lat, lng] = formData.createContactDto.location.split(',').map(Number);
        if (!isNaN(lat) && !isNaN(lng)) {
          setSelectedLatLng({ lat, lng });
        }
      } catch (error) {
        logger.error('Failed to parse location', error);
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
    setHasChanges(true);
    setIsMapModalOpen(false);
    if (validationErrors['createContactDto.location']) {
      const newErrors = { ...validationErrors };
      delete newErrors['createContactDto.location'];
      setValidationErrors(newErrors);
    }
  };

  // Map components
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

      return () => {
        document.body.style.overflow = 'unset';
      };
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
                    <span className={`h-3 w-3 ${isRTL ? 'mr-1' : 'ml-1'}`}>→</span>
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
                    <AlertTriangle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-4xl bg-white dark:bg-gray-800 shadow-xl rounded-lg mt-8 mb-8 ${isRTL ? 'rtl' : 'ltr'}`}
        >
          {/* Header */}
          <div className={`flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {t('branchManagement.modal.editTitle', { branchName: branchDetail.branchName })}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('branchManagement.modal.editDescription')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={t('common.close')}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Error Display */}
          {uploadError && (
            <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-500" />
                </div>
                <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    {t('branchManagement.modal.errors.updateError')}
                  </h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {uploadError}
                  </p>
                </div>
                <button
                  onClick={() => setUploadError(null)}
                  className={`${isRTL ? 'mr-auto' : 'ml-auto'} flex-shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300`}
                  aria-label={t('common.dismiss')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Centralized Language Control - Always Visible */}
          <div className="px-6 pt-4 pb-2">
            <LanguageFormControl
              languages={supportedLanguages}
                      selectedLanguage={selectedFormLanguage}
              onLanguageChange={setSelectedFormLanguage}
              defaultLanguage={defaultLanguage}
              showBulkFill={true}
              onBulkFill={handleBulkFillLanguage}
              fieldValues={{
                branchName: branchNameTranslations,
                branchAddress: branchAddressTranslations,
                contactHeader: contactHeaderTranslations,
                footerTitle: footerTitleTranslations,
                footerDescription: footerDescriptionTranslations,
                openTitle: openTitleTranslations,
                openDays: openDaysTranslations,
                openHours: openHoursTranslations,
              }}
            />
          </div>

          <div className="p-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className={`-mb-px flex ${isRTL ? 'space-x-reverse space-x-8' : 'space-x-8'} overflow-x-auto`}>
                {[
                  { 
                    id: 'general', 
                    label: t('branchManagement.modal.tabs.general'), 
                    icon: <Building2 className="w-4 h-4" />,
                    hasError: !!validationErrors.branchName
                  },
                  { 
                    id: 'address', 
                    label: t('branchManagement.modal.tabs.address'), 
                    icon: <MapPin className="w-4 h-4" />,
                    hasError: !!validationErrors.address
                  },
                  { 
                    id: 'contact', 
                    label: t('branchManagement.modal.tabs.contact'), 
                    icon: <Phone className="w-4 h-4" />,
                    hasError: !!validationErrors.contact
                  },
                  { 
                    id: 'workingHours', 
                    label: t('branchManagement.modal.tabs.workingHours'), 
                    icon: <Clock className="w-4 h-4" />,
                    hasError: !!validationErrors.workingHours
                  }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : tab.hasError
                        ? 'border-red-300 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.hasError && (
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <MultiLanguageInput
                      label={t('branchManagement.form.branchName') }
                      value={branchNameTranslations}
                      onChange={(newTranslations) => {
                        setBranchNameTranslations(newTranslations);
                        // Update formData with the current language value
                        const currentValue = newTranslations[currentLanguage] || newTranslations[defaultLanguage] || '';
                        updateFormData('branchName', currentValue);
                      }}
                      languages={supportedLanguages}
                      selectedLanguage={selectedFormLanguage}
                      showLanguageSelector={false}
                      placeholder={t('branchManagement.form.branchNamePlaceholder')}
                      required={false}
                      defaultLanguage={defaultLanguage}
                    />
                    {validationErrors.branchName && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {validationErrors.branchName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.whatsappNumber')}
                    </label>
                    {/* Responsive Phone Input for Whatsapp */}
                    <div className={`flex flex-col sm:flex-row gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                      <div className="w-full sm:w-1/3 md:w-1/4">
                        <CustomSelect
                          options={countryCodeOptions}
                          value={getPhoneParts(formData.whatsappOrderNumber).code}
                          onChange={(newCode) => handlePhoneCompositeChange(
                            'whatsappOrderNumber',
                            formData.whatsappOrderNumber,
                            'code',
                            String(newCode)
                          )}
                          placeholder="Code"
                        />
                      </div>
                      <input
                        type="tel"
                        value={getPhoneParts(formData.whatsappOrderNumber).number}
                        onChange={(e) => handlePhoneCompositeChange(
                          'whatsappOrderNumber', 
                          formData.whatsappOrderNumber, 
                          'number', 
                          e.target.value
                        )}
                        className="w-full sm:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors text-base"
                        placeholder={t('branchManagement.form.whatsappPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Logo Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {t('branchManagement.form.branchLogo')}
                    </label>
                    
                    {/* Current Logo Display */}
                    {imagePreview && (
                      <div className="mb-4">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt={t('branchManagement.form.branchLogo')}
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                          />
                          {!isUploadingImage && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors shadow-lg"
                              title={t('branchManagement.form.logoRemove')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          {isUploadingImage && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Upload Controls */}
                    <div className="space-y-3">
                      <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                        <input
                          type="file"
                          id="logoUpload"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          disabled={isUploadingImage}
                        />
                        <label
                          htmlFor="logoUpload"
                          className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            isUploadingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          {isUploadingImage ? (
                            <>
                              <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-400 ${isRTL ? 'ml-2' : 'mr-2'}`}></div>
                              {t('branchManagement.modal.errors.uploadingImage')}
                            </>
                          ) : (
                            <>
                              <Upload className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                              {imagePreview ? t('branchManagement.form.logoChange') : t('branchManagement.form.logoUpload')}
                            </>
                          )}
                        </label>
                        
                        {!imagePreview && !isUploadingImage && (
                          <div className={`flex items-center text-gray-400 dark:text-gray-500 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                            <ImageIcon className="h-5 w-5" />
                            <span className="text-sm">{t('branchManagement.form.logoNotSelected')}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('branchManagement.form.logoInstructions')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.country')}
                      </label>
                      <CustomSelect
                        options={countryNameOptions}
                        value={formData.createAddressDto.country || ''}
                        onChange={(val) => updateFormData('createAddressDto.country', String(val))}
                        placeholder={t('branchManagement.form.countryPlaceholder')}
                        icon={<Globe className="w-4 h-4 text-gray-400" />}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.city')}
                      </label>
                      <input
                        type="text"
                        name="createAddressDto.city"
                        value={formData.createAddressDto.city || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.cityPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.street')}
                    </label>
                    <input
                      type="text"
                      name="createAddressDto.street"
                      value={formData.createAddressDto.street || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder={t('branchManagement.form.streetPlaceholder')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.zipCode')}
                      </label>
                      <input
                        type="text"
                        name="createAddressDto.zipCode"
                        value={formData.createAddressDto.zipCode || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.zipCodePlaceholder')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.addressLine1')}
                      </label>
                      <input
                        type="text"
                        name="createAddressDto.addressLine1"
                        value={formData.createAddressDto.addressLine1 || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.addressLine1Placeholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.addressLine2')}
                    </label>
                    <input
                      type="text"
                      name="createAddressDto.addressLine2"
                      value={formData.createAddressDto.addressLine2 || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      placeholder={t('branchManagement.form.addressLine2Placeholder')}
                    />
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.phone')}
                      </label>
                      {/* Responsive Phone Input for Contact Phone */}
                      <div className={`flex flex-col sm:flex-row gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                        <div className="w-full sm:w-1/3">
                          <CustomSelect
                            options={countryCodeOptions}
                            value={getPhoneParts(formData.createContactDto.phone).code}
                            onChange={(newCode) => handlePhoneCompositeChange(
                              'createContactDto.phone',
                              formData.createContactDto.phone,
                              'code',
                              String(newCode)
                            )}
                            placeholder="Code"
                          />
                        </div>
                        <input
                          type="tel"
                          value={getPhoneParts(formData.createContactDto.phone).number}
                          onChange={(e) => handlePhoneCompositeChange(
                            'createContactDto.phone', 
                            formData.createContactDto.phone, 
                            'number', 
                            e.target.value
                          )}
                          className="w-full sm:flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors text-base"
                          placeholder={t('branchManagement.form.phonePlaceholder')}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('branchManagement.form.email')}
                      </label>
                      <input
                        type="email"
                        name="createContactDto.mail"
                        value={formData.createContactDto.mail || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('branchManagement.form.location')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="createContactDto.location"
                        value={formData.createContactDto.location || ''}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                        placeholder={t('branchManagement.form.locationPlaceholder')}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={handleOpenMapModal}
                        className={`px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <Navigation className="w-4 h-4" />
                        <span className="hidden sm:inline">{t('onboardingBranch.form.step3.location.selectOnMap')}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <MultiLanguageInput
                      label={t('branchManagement.form.contactHeader')}
                      value={contactHeaderTranslations}
                      onChange={(newTranslations) => {
                        setContactHeaderTranslations(newTranslations);
                        const currentValue = newTranslations[currentLanguage] || newTranslations[defaultLanguage] || '';
                        updateFormData('createContactDto.contactHeader', currentValue);
                      }}
                      languages={supportedLanguages}
                      selectedLanguage={selectedFormLanguage}
                      showLanguageSelector={false}
                      placeholder={t('branchManagement.form.contactHeaderPlaceholder')}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <MultiLanguageInput
                        label={t('branchManagement.form.footerTitle')}
                        value={footerTitleTranslations}
                        onChange={(newTranslations) => {
                          setFooterTitleTranslations(newTranslations);
                          const currentValue = newTranslations[currentLanguage] || newTranslations[defaultLanguage] || '';
                          updateFormData('createContactDto.footerTitle', currentValue);
                        }}
                        languages={supportedLanguages}
                      selectedLanguage={selectedFormLanguage}
                      showLanguageSelector={false}
                        placeholder={t('branchManagement.form.footerTitlePlaceholder')}
                      />
                    </div>

                    <div>
                      <MultiLanguageInput
                        label={t('branchManagement.form.openTitle')}
                        value={openTitleTranslations}
                        onChange={(newTranslations) => {
                          setOpenTitleTranslations(newTranslations);
                          const currentValue = newTranslations[currentLanguage] || newTranslations[defaultLanguage] || '';
                          updateFormData('createContactDto.openTitle', currentValue);
                        }}
                        languages={supportedLanguages}
                      selectedLanguage={selectedFormLanguage}
                      showLanguageSelector={false}
                        placeholder={t('branchManagement.form.openTitlePlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <MultiLanguageTextArea
                      label={t('branchManagement.form.footerDescription')}
                      value={footerDescriptionTranslations}
                      onChange={(newTranslations) => {
                        setFooterDescriptionTranslations(newTranslations);
                        const currentValue = newTranslations[currentLanguage] || newTranslations[defaultLanguage] || '';
                        updateFormData('createContactDto.footerDescription', currentValue);
                      }}
                      languages={supportedLanguages}
                      selectedLanguage={selectedFormLanguage}
                      showLanguageSelector={false}
                      placeholder={t('branchManagement.form.footerDescriptionPlaceholder')}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <MultiLanguageInput
                        label={t('branchManagement.form.openDays')}
                        value={openDaysTranslations}
                        onChange={(newTranslations) => {
                          setOpenDaysTranslations(newTranslations);
                          const currentValue = newTranslations[currentLanguage] || newTranslations[defaultLanguage] || '';
                          updateFormData('createContactDto.openDays', currentValue);
                        }}
                        languages={supportedLanguages}
                      selectedLanguage={selectedFormLanguage}
                      showLanguageSelector={false}
                        placeholder={t('branchManagement.form.openDaysPlaceholder')}
                      />
                    </div>

                    <div>
                      <MultiLanguageInput
                        label={t('branchManagement.form.openHours')}
                        value={openHoursTranslations}
                        onChange={(newTranslations) => {
                          setOpenHoursTranslations(newTranslations);
                          const currentValue = newTranslations[currentLanguage] || newTranslations[defaultLanguage] || '';
                          updateFormData('createContactDto.openHours', currentValue);
                        }}
                        languages={supportedLanguages}
                      selectedLanguage={selectedFormLanguage}
                      showLanguageSelector={false}
                        placeholder={t('branchManagement.form.openHoursPlaceholder')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Working Hours Tab */}
              {activeTab === 'workingHours' && (
                <div className="space-y-4">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} mb-4`}>
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {t('branchManagement.form.workingHours')}
                    </h4>
                  </div>

                  {validationErrors.workingHours && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {validationErrors.workingHours}
                      </p>
                    </div>
                  )}

                  {formData.createBranchWorkingHourCoreDto.map((hours, dayIndex) => (
                    <div key={dayIndex} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 w-24">
                            {getDayName(hours.dayOfWeek)}
                          </span>

                          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                            <input
                              title="isWorkingDay"
                              type="checkbox"
                              checked={hours.isWorkingDay}
                              onChange={(e) => handleWorkingHourChange(dayIndex, 'isWorkingDay', e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {t('branchManagement.form.isOpen')}
                            </span>
                          </div>
                        </div>

                        {hours.isWorkingDay && (
                          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                            <input
                              title="isOpen24Hours"
                              type="checkbox"
                              checked={hours.isOpen24Hours}
                              onChange={(e) => handleWorkingHourChange(dayIndex, 'isOpen24Hours', e.target.checked)}
                              className="h-4 w-4 text-green-600 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 dark:focus:ring-green-400"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {t('branchManagement.form.open24Hours') || '24 Hours'}
                            </span>
                          </div>
                        )}
                      </div>

                      {hours.isWorkingDay && !hours.isOpen24Hours && (
                        <div className="space-y-3">
                          {hours.timeSlots?.map((slot, slotIndex) => (
                            <div key={slotIndex} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <div className="flex items-center gap-2">
                                <input
                                  title="openTime"
                                  type="time"
                                  value={slot.openTime?.substring(0, 5) || '08:00'}
                                  onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'openTime', e.target.value + ':00')}
                                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                                />
                                <span className="text-gray-500 dark:text-gray-400">-</span>
                                <input
                                  title="closeTime"
                                  type="time"
                                  value={slot.closeTime?.substring(0, 5) || '22:00'}
                                  onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'closeTime', e.target.value + ':00')}
                                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
                                />
                              </div>

                              {(hours.timeSlots?.length || 0) > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}
                                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  title={t('common.remove') || 'Remove'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleAddTimeSlot(dayIndex)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                          >
                            + {t('branchManagement.form.addTimeSlot') || 'Add Time Slot'}
                          </button>
                        </div>
                      )}

                      {hours.isWorkingDay && hours.isOpen24Hours && (
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                          {t('branchManagement.form.open24HoursMessage') || 'Open 24 hours'}
                        </div>
                      )}

                      {!hours.isWorkingDay && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {t('branchManagement.form.closed') || 'Closed'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Form Actions */}
              <div className={`flex justify-end ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} pt-6 border-t border-gray-200 dark:border-gray-700`}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !hasChanges || isUploadingImage}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('branchManagement.modal.buttons.updating')}
                    </div>
                  ) : (
                    t('branchManagement.modal.buttons.update')
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      <MapPickerModal />
    </AnimatePresence>
  );
};

export default BranchEditModal;