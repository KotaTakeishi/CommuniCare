'use client'
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from "@/lib/firebaseConfig";
import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Heading,
    Flex,
    VStack,
    FormErrorMessage,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

type formInputs = {
    email: string;
    password: string;
}

/** サインアップ画面
 * @screenname SignUp
 * @description ユーザのサインアップを行う画面
 */
export default function SignUp() {
    const router = useRouter();
    const { handleSubmit, register, formState } = useForm<formInputs>();
    const { errors, isSubmitting } = formState;
    const [showPass, setShowPass] = useState<boolean>(false);

    const onSubmit = handleSubmit((data) => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                console.log(error);
            });
    });

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Flex
                flexDirection='column'
                width='100%'
                height='100vh'
                justifyContent='center'
                alignItems='center'
            >
                <VStack spacing='5'>
                    <Heading>新規登録</Heading>
                    <form onSubmit={onSubmit}>
                    <VStack spacing='4' alignItems='left'>
                        <FormControl isInvalid={errors.email ? true : false}>
                            <FormLabel htmlFor='email' textAlign='start'>
                                メールアドレス
                            </FormLabel>
                            <Input
                                id='email'
                                type='email'
                                {...register("email", {
                                    required:'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Email address must be formatted correctly',
                                    },
                                })}
                            />
                            {errors.email && <FormErrorMessage>メールアドレスを入力てください</FormErrorMessage>}
                        </FormControl>

                        <FormControl isInvalid={errors.password ? true : false}>
                            <FormLabel htmlFor='password'>パスワード</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    type={showPass ? 'text' : 'password'}
                                    {...register("password", {
                                        required:'Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'Password must have at least 6 characters',
                                        },
                                    })}
                                />
                                <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' bg='white' onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <ViewOffIcon /> : <ViewIcon />}
                                </Button>
                                </InputRightElement>
                            </InputGroup>
                            {errors.password && <FormErrorMessage>パスワードを入力てください</FormErrorMessage>}
                        </FormControl>
                        <Button
                            marginTop='4'
                            color='white'
                            bg='teal.400'
                            type='submit'
                            paddingX='auto'
                        >
                            新規登録
                        </Button>
                        <Button
                            as={Link}
                            bg='white'
                            color='black'
                            href='/signin'
                            width='100%'
                        >
                            ログインはこちら
                        </Button>
                        <Button
                            bg='white'
                            color='black'
                            width='100%'
                            onClick={signInWithGoogle}
                        >
                            <svg aria-hidden="true" className="native svg-icon iconGoogle" width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" fill="#EA4335"></path></svg>
                            Googleでログイン
                        </Button>
                    </VStack>
                    </form>
                </VStack>
            </Flex>
            {/* <form onSubmit={onSubmit}>
                <h1>SignUp</h1>
                <div>
                    <label>Email</label>
                    <input type="text"
                        {...register("email", {
                            required:'Email is required',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email address must be formatted correctly',
                            },
                        })} 
                    />
                    {errors.email && <small style={{color: 'red'}}>{errors.email.message}</small>}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password"
                        {...register("password", {
                            required:'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must have at least 6 characters',
                            },
                        })} 
                    />
                    {errors.password && <small style={{color: 'red'}}>{errors.password.message}</small>}
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <span>Loading...</span>}
                    SingUp
                </button>
                <div>
                    <Link href="/signin">SignInはこちら</Link>
                </div>
            </form>
            <div>
                <p>または</p>
                <button onClick={signInWithGoogle}>Googleでログイン</button>
            </div> */}
        </>
    );
}