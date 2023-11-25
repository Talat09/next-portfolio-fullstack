"use client";
export default function AdminContactView({ data }) {
  return (
    <div className="flex flex-col gap-5">
      {data && data?.length
        ? data.map((item) => (
            <div className="p-5 border">
              <p className="text-bold text-[#000]">Name: {item.name}</p>
              <p>
                Email: <span className="text-green-main">{item.email}</span>
              </p>
              <p>Message: {item.message}</p>
            </div>
          ))
        : null}
    </div>
  );
}
