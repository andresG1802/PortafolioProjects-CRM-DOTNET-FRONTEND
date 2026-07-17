import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    onOpenCustomerModal,
    onCloseCustomerModal,
    onOpenContactModal,
    onCloseContactModal,
    onOpenLeadModal,
    onCloseLeadModal,
    onOpenDealModal,
    onCloseDealModal,
    onOpenActivityModal,
    onCloseActivityModal,
} from '../store';

export const useUiStore = () => {
    const dispatch = useAppDispatch();
    const {
        isCustomerModalOpen,
        isContactModalOpen,
        isLeadModalOpen,
        isDealModalOpen,
        isActivityModalOpen,
    } = useAppSelector((state) => state.ui);

    return {
        isCustomerModalOpen,
        isContactModalOpen,
        isLeadModalOpen,
        isDealModalOpen,
        isActivityModalOpen,

        openCustomerModal: () => dispatch(onOpenCustomerModal()),
        closeCustomerModal: () => dispatch(onCloseCustomerModal()),
        openContactModal: () => dispatch(onOpenContactModal()),
        closeContactModal: () => dispatch(onCloseContactModal()),
        openLeadModal: () => dispatch(onOpenLeadModal()),
        closeLeadModal: () => dispatch(onCloseLeadModal()),
        openDealModal: () => dispatch(onOpenDealModal()),
        closeDealModal: () => dispatch(onCloseDealModal()),
        openActivityModal: () => dispatch(onOpenActivityModal()),
        closeActivityModal: () => dispatch(onCloseActivityModal()),
    };
};
