import { useCallback, useRef, useState } from 'react';
import { paymentService } from '../services/paymentService';
import type { Debt, PartnerInfo } from '../types/paymentTypes';

type DebtSectionState = {
    debts: Debt[];
    total: number;
    isLoading: boolean;
    error: string | null;
    adelanto: number;
};

type LoadDebtsOptions = {
    force?: boolean;
    adelanto?: number;
};

type CurrentDebtCacheEntry = {
    debts: Debt[];
    total: number;
    partnerInfo: PartnerInfo | null;
    childrenOver30: string[];
    adelanto: number;
};

type FutureDebtCacheEntry = {
    debts: Debt[];
    total: number;
    partnerInfo: PartnerInfo | null;
    adelanto: number;
};

const INITIAL_SECTION_STATE: DebtSectionState = {
    debts: [],
    total: 0,
    isLoading: false,
    error: null,
    adelanto: 0
};

const buildCacheKey = (acc: number, adelanto: number) => `${acc}:${adelanto}`;

const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message || fallback;

export const usePartnerDebts = () => {
    const [currentSection, setCurrentSection] = useState<DebtSectionState>(INITIAL_SECTION_STATE);
    const [futureSection, setFutureSection] = useState<DebtSectionState>(INITIAL_SECTION_STATE);
    const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
    const [childrenOver30, setChildrenOver30] = useState<string[]>([]);
    const currentCacheRef = useRef(new Map<string, CurrentDebtCacheEntry>());
    const futureCacheRef = useRef(new Map<string, FutureDebtCacheEntry>());
    const currentRequestIdRef = useRef(0);
    const futureRequestIdRef = useRef(0);

    const applyCurrentCache = useCallback((entry: CurrentDebtCacheEntry) => {
        setCurrentSection({
            debts: entry.debts,
            total: entry.total,
            isLoading: false,
            error: null,
            adelanto: entry.adelanto
        });
        setPartnerInfo(entry.partnerInfo);
        setChildrenOver30(entry.childrenOver30);
    }, []);

    const applyFutureCache = useCallback((entry: FutureDebtCacheEntry) => {
        setFutureSection({
            debts: entry.debts,
            total: entry.total,
            isLoading: false,
            error: null,
            adelanto: entry.adelanto
        });

        if (entry.partnerInfo) {
            setPartnerInfo(entry.partnerInfo);
        }
    }, []);

    const loadCurrentDebts = useCallback(async (acc: number, options?: LoadDebtsOptions) => {
        const adelanto = options?.adelanto ?? 0;
        const force = options?.force ?? false;
        const cacheKey = buildCacheKey(acc, adelanto);

        if (!force) {
            const cachedEntry = currentCacheRef.current.get(cacheKey);
            if (cachedEntry) {
                applyCurrentCache(cachedEntry);
                return cachedEntry;
            }
        }

        const requestId = ++currentRequestIdRef.current;
        setCurrentSection(prev => ({
            ...prev,
            isLoading: true,
            error: null,
            adelanto
        }));

        try {
            const response = await paymentService.getPartnerDebts(acc, adelanto);
            const cacheEntry: CurrentDebtCacheEntry = {
                debts: response.data.resumen_deudas || [],
                total: response.data.total_a_pagar || 0,
                partnerInfo: response.data.socio || null,
                childrenOver30: response.data.hijos_mayores_30 || [],
                adelanto
            };

            currentCacheRef.current.set(cacheKey, cacheEntry);

            if (requestId !== currentRequestIdRef.current) {
                return cacheEntry;
            }

            applyCurrentCache(cacheEntry);
            return cacheEntry;
        } catch (error: any) {
            console.error('Error fetching partner debts', error);

            if (requestId !== currentRequestIdRef.current) {
                return null;
            }

            setCurrentSection({
                debts: [],
                total: 0,
                isLoading: false,
                error: getErrorMessage(error, 'Error al cargar las deudas del socio'),
                adelanto
            });
            setPartnerInfo(null);
            setChildrenOver30([]);

            return null;
        }
    }, [applyCurrentCache]);

    const loadFutureDebts = useCallback(async (
        acc: number,
        adelanto = 12,
        options?: LoadDebtsOptions
    ) => {
        const force = options?.force ?? false;
        const cacheKey = buildCacheKey(acc, adelanto);

        if (!force) {
            const cachedEntry = futureCacheRef.current.get(cacheKey);
            if (cachedEntry) {
                applyFutureCache(cachedEntry);
                return cachedEntry;
            }
        }

        const requestId = ++futureRequestIdRef.current;
        setFutureSection(prev => ({
            ...prev,
            isLoading: true,
            error: null,
            adelanto
        }));

        try {
            const response = await paymentService.getPartnerAdvanceDebts(acc, adelanto);
            const cacheEntry: FutureDebtCacheEntry = {
                debts: response.data.resumen_deudas || [],
                total: response.data.total_a_pagar || 0,
                partnerInfo: response.data.socio || null,
                adelanto
            };

            futureCacheRef.current.set(cacheKey, cacheEntry);

            if (requestId !== futureRequestIdRef.current) {
                return cacheEntry;
            }

            applyFutureCache(cacheEntry);
            return cacheEntry;
        } catch (error: any) {
            console.error('Error fetching future partner debts', error);

            if (requestId !== futureRequestIdRef.current) {
                return null;
            }

            setFutureSection({
                debts: [],
                total: 0,
                isLoading: false,
                error: getErrorMessage(error, 'Error al cargar las deudas futuras del socio'),
                adelanto
            });

            return null;
        }
    }, [applyFutureCache]);

    const invalidatePartnerCache = useCallback((acc: number) => {
        const partnerPrefix = `${acc}:`;

        for (const cacheKey of currentCacheRef.current.keys()) {
            if (cacheKey.startsWith(partnerPrefix)) {
                currentCacheRef.current.delete(cacheKey);
            }
        }

        for (const cacheKey of futureCacheRef.current.keys()) {
            if (cacheKey.startsWith(partnerPrefix)) {
                futureCacheRef.current.delete(cacheKey);
            }
        }
    }, []);

    const clearDebts = useCallback(() => {
        currentRequestIdRef.current += 1;
        futureRequestIdRef.current += 1;
        setCurrentSection({ ...INITIAL_SECTION_STATE });
        setFutureSection({ ...INITIAL_SECTION_STATE });
        setPartnerInfo(null);
        setChildrenOver30([]);
    }, []);

    return {
        currentDebts: currentSection.debts,
        futureDebts: futureSection.debts,
        partnerInfo,
        childrenOver30,
        currentTotalDebts: currentSection.total,
        futureTotalDebts: futureSection.total,
        isCurrentLoading: currentSection.isLoading,
        isFutureLoading: futureSection.isLoading,
        currentError: currentSection.error,
        futureError: futureSection.error,
        loadCurrentDebts,
        loadFutureDebts,
        invalidatePartnerCache,
        clearDebts
    };
};
