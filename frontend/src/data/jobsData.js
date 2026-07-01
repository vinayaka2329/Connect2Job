export const getCompanyLogo = (companyName) => {
  const companyLogos = {
    Infosys: "https://logo.clearbit.com/infosys.com",
    IBM: "https://logo.clearbit.com/ibm.com",
    Google: "https://logo.clearbit.com/google.com",
    Microsoft: "https://logo.clearbit.com/microsoft.com",
    Amazon: "https://logo.clearbit.com/amazon.com",
  };

  return companyLogos[companyName] || null;
};