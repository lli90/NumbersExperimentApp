"""Generate audio number blocks"""
from boto3 import Session
from botocore.exceptions import BotoCoreError, ClientError
from contextlib import closing
import sys
from config import BASE_FILE_LOCATION

# Create a client using the credentials and region defined in the [adminuser]
# section of the AWS credentials file (~/.aws/credentials).
session = Session(profile_name="polly")
polly = session.client("polly")

def get_audio_clip(number_blocks):

    number_blocks = [str(number).zfill(5) for number in number_blocks]
    filename = '_'.join(number_blocks)

    verbal_number_blocks = [" ".join(block) + ' ' for block in number_blocks]
    text_to_speak = " ".join(verbal_number_blocks)

    try:
        # Request speech synthesis
        # Need to find a way to make polly take a break between each block
        response = polly.synthesize_speech(Text=text_to_speak, OutputFormat="mp3",
                                            VoiceId="Emma")
    except (BotoCoreError, ClientError) as error:
        # The service returned an error, exit gracefully
        print(error)
        sys.exit(-1)

    # Access the audio stream from the response
    if "AudioStream" in response:
        # Note: Closing the stream is important because the service throttles on the
        # number of parallel connections. Here we are using contextlib.closing to
        # ensure the close method of the stream object will be called automatically
        # at the end of the with statement's scope.
            with closing(response["AudioStream"]) as stream:
               output = f"{BASE_FILE_LOCATION}audio/{filename}.mp3"

               try:
                # Open a file for writing the output as a binary stream
                    with open(output, "wb") as file:
                       file.write(stream.read())
               except IOError as error:
                  # Could not write to file, exit gracefully
                  print(error)
                  sys.exit(-1)

    else:
        # The response didn't contain audio data, exit gracefully
        print("Could not stream audio")
        sys.exit(-1)

    return(output)

#get_audio_clip([11226,25536,43511,59432,44815])