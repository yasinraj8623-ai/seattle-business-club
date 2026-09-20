"use client";

import React from "react";
import { motion } from "framer-motion";

import { fadeUp } from "@/components/motion/reveal";
import { HoverScale } from "@/components/motion/HoverScale";

import PhoneIcon from "@/components/icons/PhoneIcon";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";
import GlobeIcon from "@/components/icons/GlobeIcon";
import TicketIcon from "@/components/icons/TicketIcon";
import SendIcon from "@/components/icons/SendIcon";
import Field from "./Field";
import IconInput from "./IconInput";
import SelectInput from "./SelectInput";

const inputClass =
  "w-full border border-[rgba(36,36,36,0.60)] bg-[rgba(0,0,0,0.64)] backdrop-blur-md rounded-xs px-4 py-3 text-sm text-white placeholder:text-[#8C8C8C] leading-5 outline-none transition-colors focus:border-[#4A5DF9]";

const textareaClass = `${inputClass} resize-y min-h-[80px] max-h-[180px]`;

const Form = () => {
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ delay: 0.1 }}
      className="space-y-6 pt-8 sm:pt-12 px-4 sm:px-8 pb-6 sm:pb-8 border border-[rgba(36,36,36,0.60)] bg-[rgba(0,0,0,0.64)] backdrop-blur-md"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        <Field label="First Name" required>
          <input name="firstName" type="text" placeholder="Yasin" required className={inputClass} />
        </Field>
        <Field label="Last Name" required>
          <input name="lastName" type="text" placeholder="Raj" required className={inputClass} />
        </Field>
      </div>

      <Field label="Email Address" required>
        <input name="email" type="email" placeholder="yasinraj@email.com" required className={inputClass} />
      </Field>

      <Field label="Phone Number" required>
        <IconInput icon={<PhoneIcon />}>
          <input name="phone" type="tel" placeholder="(555) 123-4567" required className={inputClass} />
        </IconInput>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        <Field label="Age" required>
          <input name="age" type="number" min={0} placeholder="Enter your age" required className={inputClass} />
        </Field>
        <Field label="City">
          <SelectInput name="city" defaultValue="">
            <option value="" disabled>
              Select city
            </option>
            {["Seattle", "Bellevue", "Tacoma", "Everett", "Other"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <Field label="Profession / Role">
        <input name="profession" type="text" placeholder="e.g. Product Manager at Google" className={inputClass} />
      </Field>

      <Field label="LinkedIn Profile" required>
        <IconInput icon={<LinkedInIcon />}>
          <input name="linkedin" type="url" placeholder="linkedin.com/in/yourprofile" required className={inputClass} />
        </IconInput>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        <Field label="Instagram">
          <IconInput icon={<InstagramIcon />}>
            <input name="instagram" type="text" placeholder="instagram.com/username" className={inputClass} />
          </IconInput>
        </Field>
        <Field label="Website" optional>
          <IconInput icon={<GlobeIcon />}>
            <input name="website" type="url" placeholder="yourwebsite.com" className={inputClass} />
          </IconInput>
        </Field>
      </div>

      <Field label="How did you find out about Seattle Business Club?" required>
        <SelectInput name="source" defaultValue="">
          <option value="" disabled>
            Select an option
          </option>
          {["Instagram", "LinkedIn", "A friend or colleague", "An event", "Other"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectInput>
      </Field>

      <Field label="What are you passionate about?" required>
        <textarea
          name="passion"
          rows={3}
          placeholder="Tell us about your interests, hobbies, and what drives you..."
          required
          className={textareaClass}
        />
      </Field>

      <Field label="If you had one message to share with the world, what would it be?" required>
        <textarea
          name="oneMessage"
          rows={3}
          placeholder="Share your expertise or unique perspective..."
          required
          className={textareaClass}
        />
      </Field>

      <Field label="Why do you want to join Seattle Business Club?" required>
        <textarea
          name="whyJoin"
          rows={3}
          placeholder="What are you hoping to get from this community?"
          required
          className={textareaClass}
        />
      </Field>

      <Field
        label="If someone from Seattle Business Club were to introduce you to someone, who would that person be?"
        optional
      >
        <textarea
          name="introduction"
          rows={3}
          placeholder="A type of person, a role, or even a specific name..."
          className={textareaClass}
        />
      </Field>

      <div className="pt-2 border-t border-[#242424] space-y-3">
        <label className="flex items-center gap-2 text-[#F5F4F0] text-sm leading-normal">
          <TicketIcon />
          Referral Code <span className="font-normal text-xs text-[#8C8C8C]">(optional)</span>
        </label>
        <input
          name="referralCode"
          type="text"
          placeholder="ENTER AN AMBASSADOR'S REFERRAL CODE"
          className={`${inputClass} tracking-[0.7px] uppercase placeholder:normal-case sm:placeholder:uppercase`}
        />
        <p className="text-sm text-white">
          If a <span className="font-medium text-white/70">Seattle Business Club</span> ambassador invited you, enter
          their code here.
        </p>
      </div>

      <HoverScale className="block w-full">
        <button
          type="submit"
          className="group cursor-pointer flex w-full items-center justify-center gap-2 rounded-xs bg-[#5B9CFF] hover:bg-[#4A5DF9] hover:bg-[radial-gradient(47.16%_130.25%_at_68.75%_-16.25%,rgba(255,255,255,0.30)_0%,rgba(255,255,255,0)_100%)] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] px-6 py-4 font-semibold text-[rgba(11,11,19,0.70)] hover:text-white transition-colors duration-300 ease-out"
        >
          <span>{submitted ? "Application Sent" : "Submit Application"}</span>
          <SendIcon className="stroke-current group-hover:stroke-current" />
        </button>
      </HoverScale>

      <p className="text-center text-xs leading-[140%] text-[#8C8C8C]">
        Applications are reviewed within 48–72 hours. Seattle Business Club is a paid members community — approved
        applicants will receive payment details by email.
        <span className="font-semibold text-[#EFEFEF]">
          Limited offer: the first 100 approved members lock in $100/month for life. Rates will increase in the future.
        </span>{" "}
      </p>
    </motion.form>
  );
};

export default Form;
