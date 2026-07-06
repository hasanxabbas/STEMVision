export const toList = (data, keys = []) => {
  if (Array.isArray(data)) return data

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key]
  }

  if (Array.isArray(data?.data)) return data.data
  return []
}

export const getItemId = (item) =>
  item?.id || item?._id || item?.slug || item?.title || item?.name

export const getApiMessage = (data, fallback) =>
  data?.message || data?.error || fallback
