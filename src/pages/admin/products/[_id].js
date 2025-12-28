import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "@/contexts/AdminContext";
import withAdminAuth from "@/hocs/withAdminAuth";
import { FaArrowLeft, FaTrash, FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const ProductDetailPage = () => {
  const {
    getProduct,
    updateProduct,
    deleteProduct,
    loading: adminLoading,
  } = useAdmin();
  const router = useRouter();
  const { _id } = router.query;
  const imageInputRef = useRef(null);
  const lookImageInputRef = useRef(null);

  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useQuery({
    queryKey: ["product", _id],
    queryFn: () => getProduct(_id),
    enabled: router.isReady && !!_id,
    refetchOnWindowFocus: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: "",
    gender: "",
    isFeatured: false,
  });

  // State for complex fields
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [details, setDetails] = useState([]);

  // State for inputs for complex fields
  const [sizeInput, setSizeInput] = useState("");
  const [colorNameInput, setColorNameInput] = useState("");
  const [colorHexInput, setColorHexInput] = useState("#000000");
  const [detailInput, setDetailInput] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [lookImageFiles, setLookImageFiles] = useState([]);
  const [lookImagePreviews, setLookImagePreviews] = useState([]);
  const [existingLookImages, setExistingLookImages] = useState([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        inStock: product.inStock || "",
        gender: product.gender || "",
        isFeatured: product.isFeatured || false,
      });
      setSizes(product.sizes || []);
      setColors(product.colors || []);
      setDetails(product.details || []);
      setExistingImages(product.images || []);
      setExistingLookImages(product.lookImages || []);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handlers for complex fields
  const addSize = () => {
    if (sizeInput && !sizes.includes(sizeInput)) {
      setSizes([...sizes, sizeInput]);
      setSizeInput("");
    }
  };
  const removeSize = (index) => setSizes(sizes.filter((_, i) => i !== index));

  const addColor = () => {
    if (colorNameInput && colorHexInput) {
      setColors([...colors, { name: colorNameInput, hex: colorHexInput }]);
      setColorNameInput("");
      setColorHexInput("#000000");
    }
  };
  const removeColor = (index) =>
    setColors(colors.filter((_, i) => i !== index));

  const addDetail = () => {
    if (detailInput && !details.includes(detailInput)) {
      setDetails([...details, detailInput]);
      setDetailInput("");
    }
  };
  const removeDetail = (index) =>
    setDetails(details.filter((_, i) => i !== index));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    const newImagePreviewsArr = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newImagePreviewsArr]);
  };

  const handleRemoveNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLookImageChange = (e) => {
    const files = Array.from(e.target.files);
    setLookImageFiles((prev) => [...prev, ...files]);
    const newImagePreviewsArr = files.map((file) => URL.createObjectURL(file));
    setLookImagePreviews((prev) => [...prev, ...newImagePreviewsArr]);
  };

  const handleRemoveNewLookImage = (index) => {
    setLookImageFiles((prev) => prev.filter((_, i) => i !== index));
    setLookImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingLookImage = (index) => {
    setExistingLookImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append simple fields
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    // Append complex fields as JSON strings
    data.append("sizes", JSON.stringify(sizes));
    data.append("colors", JSON.stringify(colors));
    data.append("details", JSON.stringify(details));

    // Append the list of EXISTING images to keep as a JSON string
    data.append("images", JSON.stringify(existingImages));
    data.append("lookImages", JSON.stringify(existingLookImages));

    // Append NEW image files using the SAME keys
    imageFiles.forEach((file) => {
      data.append("images", file);
    });
    lookImageFiles.forEach((file) => {
      data.append("lookImages", file);
    });

    try {
      // Assuming your mutation expects an object with the product ID and the form data
      await updateProduct.mutateAsync({ id: _id, data: data });
      Swal.fire({
        icon: "success",
        title: "Product Updated",
        text: "The product has been updated successfully.",
      });
      router.push("/admin/products"); // Optional: Redirect after success
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
      });
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteProduct.mutateAsync(_id);
        router.push("/admin/");
      }
    });
  };

  if (productLoading || !router.isReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (productError) {
    return <div>Error fetching product details.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaTrash className="mr-2" />
          Delete
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col gap-4">
            {/* Product Images */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Product Images
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {existingImages.map((image, index) => (
                  <div key={image.public_id || index} className="relative">
                    <img
                      src={image.url}
                      alt={`Existing product image ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`New product image ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current.click()}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                  >
                    <FaPlus className="text-gray-400" />
                    <span className="text-sm text-gray-500">Add Image</span>
                  </button>
                  <input
                    type="file"
                    multiple
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>

            {/* Look Images */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Look Images
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {existingLookImages.map((image, index) => (
                  <div key={image.public_id || index} className="relative">
                    <img
                      src={image.url}
                      alt={`Existing look image ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingLookImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                {lookImagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`New look image ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewLookImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => lookImageInputRef.current.click()}
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                  >
                    <FaPlus className="text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Add Look Image
                    </span>
                  </button>
                  <input
                    type="file"
                    multiple
                    ref={lookImageInputRef}
                    onChange={handleLookImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Form fields */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stock
                </label>
                <input
                  type="number"
                  name="inStock"
                  id="inStock"
                  value={formData.inStock}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <input
                  type="text"
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              {/* Sizes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Sizes
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    placeholder="Add a size"
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizes.map((size, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-200 rounded-full px-3 py-1 text-sm"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Colors
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={colorNameInput}
                    onChange={(e) => setColorNameInput(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    placeholder="Color name"
                  />
                  <input
                    type="color"
                    value={colorHexInput}
                    onChange={(e) => setColorHexInput(e.target.value)}
                    className="h-10 w-10 rounded-md border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1 text-sm"
                    >
                      <span
                        style={{ backgroundColor: color.hex }}
                        className="w-4 h-4 rounded-full border border-gray-400"
                      ></span>
                      {color.name}
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Details
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={detailInput}
                    onChange={(e) => setDetailInput(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    placeholder="Add a detail"
                  />
                  <button
                    type="button"
                    onClick={addDetail}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-200 rounded-full px-3 py-1 text-sm"
                    >
                      {detail}
                      <button
                        type="button"
                        onClick={() => removeDetail(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="isFeatured"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Is Featured
                </label>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={adminLoading}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                {adminLoading ? "Updating..." : "Update Product"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default withAdminAuth(ProductDetailPage);
