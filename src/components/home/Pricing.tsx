import { Link } from "react-router-dom";


const PricingCard = ({ title, description, price, features, supportDuration , id }: any) => {
  return (
    <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow xl:p-8">
      <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
      <p className="font-light text-gray-500 sm:text-lg">{description}</p>
      <div className="flex justify-center items-baseline my-8">
        <span className="mr-2 text-5xl font-extrabold">₹{price}</span>
        <span className="text-gray-500">/ {supportDuration} days</span>
      </div>
      <ul role="list" className="mb-8 space-y-4 text-left">
        {features?.map((feature: any, index: any) => (
          <li key={index} className="flex items-center space-x-3">
            {feature.available ? (
              <svg className="flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="flex-shrink-0 w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            <span>{feature.name}</span>
          </li>
        ))}
        <li className="flex items-center space-x-3">
          <span>Duration: <span className="font-semibold">{supportDuration} Days</span></span>
        </li>
        {/* <li className="flex items-center space-x-3">
          <span>Free updates: <span className="font-semibold">{updateDuration}</span></span>
        </li> */}
      </ul>
      <Link  to={`/onboarding-details/${id}`} className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get started</Link>
    </div>
  );
};

const Pricing = ({ data }: { data: any }) => {

  const sortedData = data?.sort((a: any, b: any) => a.price - b.price);


  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            Designed for business teams like yours dkfhi
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl">
            Here at Flowbite we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 md:grid-cols-2 sm:gap-6 xl:gap-10 lg:space-y-0">
          {sortedData?.map((option: any, index: any) => (
            <PricingCard 
              key={index}
              title={option.name}
              description={option.description}
              price={option.price}
              features={option.benefits}
              supportDuration={`${option.duration}`}
              id = {option?._id}
              // updateDuration={`${option.duration} months`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
