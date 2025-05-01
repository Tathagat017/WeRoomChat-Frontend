import {
  useQuery as useReactQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

import { QueryKeys } from "../types/query-keys";
export declare type QueryKey = [
  keyof typeof QueryKeys,
  string?,
  number?,
  ...(string | number | undefined)[]
];

export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "initialData"
  > & {
    initialData?: () => undefined;
  }
): UseQueryResult<TData, TError> {
  return useReactQuery({
    queryKey: options.queryKey,
    queryFn: options.queryFn,
    onSuccess: options.onSuccess,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    retry: false,
    enabled: options.enabled ?? true,
    refetchInterval: options.refetchInterval ?? false,
    refetchOnMount: options.refetchOnMount == false ? false : true,
  });
}
