'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Form from '@components/Form';

const EditPrompt = () => {
    const router = useRouter();

    const [submitting, setSubmitting] = useState(false);
    const [post, setPost] = useState({
        prompt: '',
        tag: '',
    });

    // State to hold the prompt ID
    const [promptId, setPromptId] = useState(null);

    useEffect(() => {
      // Check if router is ready
      if (router.isReady) {
        const id = new URLSearchParams(window.location.search).get('id'); // Use this to extract 'id' from URL
        setPromptId(id); // Set the prompt ID in state
      }
    }, [router.isReady]);

    useEffect(() => {
        const getPromptDetails = async () => {
            const response = await fetch(`/api/prompt/${promptId}`)
            const data = await response.json();

            setPost({
                prompt: data.prompt,
                tag: data.tag,
            })
        }

        if(promptId) getPromptDetails();
    }, [promptId])


    const updatePrompt = async (e) => {
        e.preventDefault();
        setSubmitting(true);
    
        if (!promptId) return alert("Missing PromptId!");
    
        try {
          const response = await fetch(`/api/prompt/${promptId}`, {
            method: "PATCH",
            body: JSON.stringify({
              prompt: post.prompt,
              tag: post.tag,
            }),
          });
    
          if (response.ok) {
            router.push("/");
          }
        } catch (error) {
          console.log(error);
        } finally {
            setSubmitting(false);
        }
      };

    return (
        <Form 
            type="Edit"
            post={post}
            setPost={setPost}
            submitting={submitting}
            handleSubmit={updatePrompt}
        
        />

    )
}

export default EditPrompt