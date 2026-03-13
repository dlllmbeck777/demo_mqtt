import * as React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Link,
} from "@mui/material";

const PrivacyPolicy = () => {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box component="span">
      <Box
        component="span"
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ cursor: "pointer" }}
      >
        Privacy Policy{" "}
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        scroll="body"
        PaperProps={{
          style: {
            overflow: "visible",
            marginTop: "60px",
          },
        }}
      >
        <DialogTitle sx={{ paddingY: "0px" }}>
          <Box
            sx={{
              background: "linear-gradient(to right, #212121, #616161)",
              color: "#ffffff",
              padding: 2,
              borderRadius: "10px",
              boxShadow: 8,
              position: "relative",
              top: "-30px",
            }}
          >
            <Typography sx={{ typography: "h4" }}>Privacy Policy</Typography>
            <Typography sx={{ typography: "h6", color: "#ffffff99" }}>
              Date of Last Revision: June 13th, 2022
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers={false}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Thank you for your interest in Dataiku! We are committed to
            protecting the privacy of the individuals who visit our websites,
            (“Visitors”){" "}
            <Link target="_blank" href="https://www.dataiku.com">
              www.dataiku.com
            </Link>{" "}
            or{" "}
            <Link target="_blank" href="https://www.banana-data.com">
              www.banana-data.com
            </Link>
            , including all subdomains (“Websites”) and users of any version of
            our software (“Service”) who are registered, subscribed, or using
            our Service under an agreement with us (“Users”) (collectively
            “you”). This Privacy Policy applies to you and to the Dataiku family
            of companies. A list of Dataiku’s affiliates is provided in the
            Dataiku License Terms. You can contact us at{" "}
            <Link
              to="javascript:void(0)"
              onClick={() => (window.location = "mailto:privacy@dataiku.com")}
            >
              privacy@dataiku.com
            </Link>
            .
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            The Dataiku License Terms govern the delivery and usage of the
            Installed delivery method of Dataiku’s Data Science Studio (DSS).
            The Dataiku Online Terms govern the delivery and usage of the
            Dataiku Online platform, the Software-as-a-Service version of DSS,
            including any data imported into Dataiku Online by a customer.{" "}
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Plain English: Thanks for stopping by! This Privacy Policy covers
            use of our websites and our Service. The Dataiku Online Terms covers
            use of the Dataiku Online platform.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            This Privacy Policy sets forth Dataiku’s policy with respect to
            information, including personally identifiable information
            (“Personal Data”) and other information collected from Visitors and
            Users. This Privacy Policy is also relevant to any Personal Data or
            other information collected from contacts via tools, events, or
            hosted content on other platforms. To make this document easy to
            read and understand, we have separated the text into two parts: a
            plain English section for easy readability, and a legal section.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Plain English: Read this section to easily understand our position
            with regard to your privacy.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            This policy describes the information we receive and process and how
            it is used. Please review this Privacy Policy carefully. Any use of
            information or Personal Data received from you shall always be
            limited to the following purposes: (i) helping us improve our
            websites; (ii) helping us improve our Service; (iii) helping us
            engage with you about our Service; (iv) helping us provide our
            Service to you and others; and (v) helping us provide support for
            the Service to you and others. We will not sell any of your
            information or Personal Data.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Plain English: We use your information to help us improve and make
            our customers happy! We will not sell any of your information.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            By visiting any of our Websites or using our Service, you accept and
            consent to this Privacy Policy.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Plain English: If you continue, you accept and agree to the contents
            of this Privacy Policy.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            A. Information We Receive From You
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            When you register as a User, certain information such as name,
            company name, contact telephone number, and email address may be
            collected. When a Visitor contacts us and/or requests information
            about our Service, we will collect each Visitor’s email address and
            some other contact information in order to fulfill the Visitor’s
            request. We may also ask Visitors for their name, company name,
            telephone number, and email address. We may also ask questions about
            your company, job, and professional background. As you browse our
            Websites, your browser may send log data which may include your IP
            address, browser type, browser version, pages visited, time and date
            of visit, time spent on those pages, and referring pages, among
            other information.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Plain English: We may collect your name, company name, contact
            telephone number, and email address. We may also ask for some other
            information related to your company and job. Sometimes your browser
            may send us some other information that tells us how you are using
            our Websites.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            If you are a User, we may collect Personal Data from you in order to
            properly register you or issue you a license to use our Service or
            to service a support request from you relating to our Service. This
            may include name, company name, email address, job title,
            department, IP address, and usage information relating to our
            Service.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            We may also send Service related notifications, announcements or
            communications related to our company to your email address if you
            are a User.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Plain English: We collect information from you in order to make sure
            that you are able to access our Service and we may also send you
            service-related emails.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            If you wish to subscribe to a newsletter via our Websites or access
            other content from our Websites, we will collect Personal Data, such
            as your name and email address, in order to send you the newsletter.
            You may choose to stop receiving our newsletter or marketing emails
            by following unsubscribe instructions included in each of these
            emails, or you can contact us at{" "}
            <Link
              to="javascript:void(0)"
              onClick={() => (window.location = "mailto:privacy@dataiku.com")}
            >
              privacy@dataiku.com
            </Link>
            . For marketing purposes, you consent to Dataiku sharing with
            sponsoring partners your contact information and sponsor interaction
            activity when you attend a Dataiku conference.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Plain English: Thank you for your interest in our newsletters or
            other content. If you changed your mind about your newsletter or do
            not want to get emails from our marketing team, you can easily
            unsubscribe by following instructions included in the email or by
            contacting us at
            <Link
              to="javascript:void(0)"
              onClick={() => (window.location = "mailto:privacy@dataiku.com")}
            >
              privacy@dataiku.com
            </Link>
            . At a Dataiku marketing event, your contact information and sponsor
            interaction activity may be shared with Dataiku’s sponsors.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            We may also collect Personal Data from you if you contact us through
            third parties, including but not limited to: (i) Intercom for
            chatting with us through our Websites; (ii) Meetup for joining any
            of our groups; (iii) Eventbrite for registering or attending any of
            our events; (iv) Typeform or GoDaddy for responding to our surveys;
            (v) Delighted for providing us user feedback; (vi) Teachable for
            registering to view any of our content there; (vii) Workable for
            applying for a job at Dataiku; (viii) Freshdesk for submitting
            support tickets. Any third party that collects your information will
            have their own privacy policies governing how they use and protect
            your information. We encourage you to read those privacy policies.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Plain English: We may collect information from you if you use a
            third party to contact or correspond with us. These third parties
            have their own privacy policies and we encourage you to become
            familiar with them.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            We may collect Personal Data, including name, email address, and
            company name from people who attend our events or third party events
            which we attend. This information is generally collected using a
            lead scanner or other means with each individual’s consent.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PrivacyPolicy;
